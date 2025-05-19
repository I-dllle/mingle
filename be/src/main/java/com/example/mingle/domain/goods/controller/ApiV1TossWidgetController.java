package com.example.mingle.domain.goods.controller;

import com.example.mingle.domain.goods.dto.GoodsOrderRequestDto;
import com.example.mingle.domain.goods.dto.GoodsOrderResponseDto;
import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.goods.repository.GoodsRepository;
import com.example.mingle.domain.goods.service.GoodsService;
import com.example.mingle.domain.goods.service.OrderService;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.user.user.service.UserService;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("api/v1/goodsOrder")
@RequiredArgsConstructor
@Tag(name = "GoodsOrder", description = "결제 관련 API")
public class ApiV1TossWidgetController {

    @Value("${toss.payments.api-key}")
    private String API_KEY;

    @Autowired
    private OrderService orderService;
    private final UserRepository userRepository;
    private final GoodsRepository goodsRepository;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // 결제 페이지 렌더링
    @Operation(
        summary = "결제 페이지 조회",
        description = "상품 결제를 위한 결제 페이지를 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 페이지 조회 성공"),
            @ApiResponse(responseCode = "404", description = "상품 또는 사용자를 찾을 수 없음")
        }
    )
    @GetMapping("/payment/{goodsId}")
    public String showPaymentPage(
            @Parameter(description = "상품 ID", required = true) @PathVariable Long goodsId,
            @Parameter(description = "사용자 ID", required = true) @AuthenticationPrincipal SecurityUser user,
            Model model) {
        
        // 상품 정보 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));
        
        // 주문 ID 생성 (UUID 사용)
        String orderId = UUID.randomUUID().toString();
        
        // 모델에 데이터 추가
        model.addAttribute("goods", goods);
        model.addAttribute("user", user);
        model.addAttribute("orderId", orderId);
        
        return "templates"; // templates.html 템플릿을 렌더링
    }

    // 주문 생성용 API (결제 전 호출)
    @Operation(
        summary = "주문 생성",
        description = "결제 전 주문 정보를 생성합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "주문 생성 성공"),
            @ApiResponse(responseCode = "404", description = "상품 또는 사용자를 찾을 수 없음")
        }
    )
    @PostMapping("/api/orders")
    public ResponseEntity<GoodsOrderResponseDto> createOrder(
            @Parameter(description = "주문 정보", required = true) @RequestBody GoodsOrderRequestDto requestDto,
            @Parameter(description = "사용자 ID", required = true)
            @AuthenticationPrincipal SecurityUser user
    ) {
        User orderUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        Goods goods = goodsRepository.findById(requestDto.getGoods().getId())
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));

        GoodsOrderResponseDto responseDto = orderService.createOrder(requestDto, orderUser, goods);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
        summary = "결제 승인",
        description = "토스페이먼츠 결제를 승인합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 승인 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 결제 정보"),
            @ApiResponse(responseCode = "404", description = "주문을 찾을 수 없음")
        }
    )
    @RequestMapping(value = "/confirm")
    public ResponseEntity<JSONObject> confirmPayment(
            @Parameter(description = "결제 승인 정보", required = true) @RequestBody String jsonBody) throws Exception {

        JSONParser parser = new JSONParser();
        String orderId;
        String amount;
        String paymentKey;
        try {
            // 클라이언트에서 받은 JSON 요청 바디입니다.
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            paymentKey = (String) requestData.get("paymentKey");
            orderId = (String) requestData.get("orderId");
            amount = (String) requestData.get("amount");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        };
        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        String widgetSecretKey = API_KEY;

        // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
        // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        // 결제 승인 API를 호출
        // 결제를 승인하면 결제수단에서 금액이 차감돼요.
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes("UTF-8"));

        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        // 결제 성공시 금액 검증 후 결제 완료 처리
        orderService.checkAmount(orderId, amount);
        if (isSuccess) {
            orderService.setPaymentComplete(orderId, paymentKey);
        }

        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);
        responseStream.close();

        return ResponseEntity.status(code).body(jsonObject);
    }

    @Operation(
        summary = "결제 성공 페이지",
        description = "결제 성공 시 리다이렉트되는 페이지입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 성공 페이지 조회")
        }
    )
    @RequestMapping(value = "/success", method = RequestMethod.GET)
    public String paymentRequest(
            @Parameter(description = "HTTP 요청 정보") HttpServletRequest request,
            @Parameter(description = "뷰 모델") Model model) throws Exception {
        return "/success";
    }

    @Operation(
        summary = "결제 페이지",
        description = "결제를 진행할 수 있는 메인 페이지입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 페이지 조회")
        }
    )
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(
            @Parameter(description = "상품 ID", required = true) @RequestParam Long goodsId,
            @Parameter(description = "사용자 ID", required = true) @AuthenticationPrincipal SecurityUser user,
            @Parameter(description = "HTTP 요청 정보") HttpServletRequest request,
            @Parameter(description = "뷰 모델") Model model) throws Exception {
        
        // 상품 정보 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));
        
        // 주문 ID 생성 (UUID 사용)
        String orderId = UUID.randomUUID().toString();
        
        // 모델에 데이터 추가
        model.addAttribute("goods", goods);
        model.addAttribute("user", user);
        model.addAttribute("orderId", orderId);
        
        return "checkout";
    }

    @Operation(
        summary = "결제 실패 페이지",
        description = "결제 실패 시 리다이렉트되는 페이지입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 실패 페이지 조회")
        }
    )
    @RequestMapping(value = "/fail", method = RequestMethod.GET)
    public String failPayment(
            @Parameter(description = "HTTP 요청 정보") HttpServletRequest request,
            @Parameter(description = "뷰 모델") Model model) throws Exception {
        String failCode = request.getParameter("code");
        String failMessage = request.getParameter("message");

        model.addAttribute("code", failCode);
        model.addAttribute("message", failMessage);

        return "/fail";
    }

}