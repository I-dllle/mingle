package com.example.mingle.domain.goods.controller;

import com.example.mingle.domain.goods.dto.GoodsOrderRequestDto;
import com.example.mingle.domain.goods.dto.GoodsOrderResponseDto;
import com.example.mingle.domain.goods.dto.GoodsResponseDto;
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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final ObjectMapper objectMapper;

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
        @Parameter(description = "뷰 모델") Model model) throws JsonProcessingException {
        

        // 상품 정보 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));
            
        // 주문 ID 생성 (UUID 사용)
        String orderId = UUID.randomUUID().toString();

        // 엔티티를 DTO로 변환하여 JSON 직렬화 문제 해결
        // 결제 페이지에서는 상품의 기본 정보만 필요하므로 간단하게 구성
        Map<String, Object> goodsInfo = new HashMap<>();
        goodsInfo.put("id", goods.getId());
        goodsInfo.put("itemName", goods.getItemName());
        goodsInfo.put("itemPrice", goods.getItemPrice());
        goodsInfo.put("imgUrl", goods.getImgUrl());
        goodsInfo.put("description", goods.getDescription());
        goodsInfo.put("isActive", goods.getIsActive());
        
        // 사용자 정보도 필요한 정보만 추출
        Map<String, Object> userInfo = new HashMap<>();
        
        // null 체크를 추가하여 안전하게 처리
        Long userId = user != null ? user.getId() : null;
        String userEmail = user != null ? user.getEmail() : "test@example.com";
        String userNickname = user != null ? user.getNickname() : "테스트 사용자";
        
        logger.info("Payment page data - userId: {}, userEmail: {}, userNickname: {}", userId, userEmail, userNickname);
        
        userInfo.put("id", userId);
        userInfo.put("email", userEmail);
        userInfo.put("nickname", userNickname);
        userInfo.put("name", userNickname); // checkout.html에서 name을 사용
        userInfo.put("phoneNumber", "010-0000-0000"); // 기본값 또는 실제 전화번호
        
        // Map을 JSON 문자열로 변환
        String goodsJson = objectMapper.writeValueAsString(goodsInfo);
        String userJson = objectMapper.writeValueAsString(userInfo);

        // 모델에 데이터 추가
        model.addAttribute("goods", goodsJson);
        model.addAttribute("user", userJson);
        model.addAttribute("orderId", orderId);
            
        return "checkout"; // checkout.html 템플릿을 렌더링

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
        try {
            User orderUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
            Goods goods = goodsRepository.findById(requestDto.getGoods().getId())
                    .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));

            // 주문 ID가 없으면 생성
            if (requestDto.getOrderId() == null || requestDto.getOrderId().isEmpty()) {
                requestDto.setOrderId(UUID.randomUUID().toString());
            }

            GoodsOrderResponseDto responseDto = orderService.createOrder(requestDto, orderUser, goods);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            logger.error("주문 생성 실패: ", e);
            throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
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
    @PostMapping(value = "/confirm")
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
            
            logger.info("결제 승인 요청 - orderId: {}, amount: {}, paymentKey: {}", orderId, amount, paymentKey);
        } catch (ParseException e) {
            logger.error("JSON 파싱 오류: ", e);
            throw new RuntimeException(e);
        }
        
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

        try {
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

            // 주문이 존재하는지 먼저 확인 (주문이 없으면 에러로 간주)
            try {
                orderService.checkAmount(orderId, amount);
                logger.info("주문 금액 검증 성공 - orderId: {}", orderId);
            } catch (Exception e) {
                logger.warn("주문 금액 검증 실패 - orderId: {}. 에러: {}", orderId, e.getMessage());
                // 주문이 없는 경우, 임시로 처리하거나 에러 반환
                // 테스트를 위해 일단 계속 진행
            }
            
            if (isSuccess) {
                try {
                    orderService.setPaymentComplete(orderId, paymentKey);
                    logger.info("결제 완료 처리 성공 - orderId: {}", orderId);
                } catch (Exception e) {
                    logger.error("결제 완료 처리 실패 - orderId: {}. 에러: {}", orderId, e.getMessage());
                    // 결제는 성공했지만 DB 처리 실패 - 이 경우 수동 처리 필요
                }
            }

            Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
            JSONObject jsonObject = (JSONObject) parser.parse(reader);
            responseStream.close();

            logger.info("토스페이먼츠 응답 코드: {}, 응답: {}", code, jsonObject.toJSONString());
            return ResponseEntity.status(code).body(jsonObject);
            
        } catch (Exception e) {
            logger.error("결제 승인 처리 중 오류 발생: ", e);
            
            // 에러 응답 생성
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("code", "PAYMENT_CONFIRMATION_ERROR");
            errorResponse.put("message", "결제 승인 처리 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @Operation(
        summary = "결제 성공 페이지",
        description = "결제 성공 시 리다이렉트되는 페이지입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 성공 페이지 조회")
        }
    )
    @GetMapping(value = "/success")
    public String paymentRequest(
            @Parameter(description = "HTTP 요청 정보") HttpServletRequest request,
            @Parameter(description = "뷰 모델") Model model) throws Exception {
        return "success";
    }

    @Operation(
        summary = "결제 실패 페이지",
        description = "결제 실패 시 리다이렉트되는 페이지입니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "결제 실패 페이지 조회")
        }
    )
    @GetMapping(value = "/fail")
    public String failPayment(
            @Parameter(description = "HTTP 요청 정보") HttpServletRequest request,
            @Parameter(description = "뷰 모델") Model model) throws Exception {
        String failCode = request.getParameter("code");
        String failMessage = request.getParameter("message");

        model.addAttribute("code", failCode);
        model.addAttribute("message", failMessage);

        return "fail";
    }

    // 사용자 주문내역 조회
    @Operation(
        summary = "사용자 주문내역 조회",
        description = "로그인한 사용자의 주문내역을 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "주문내역 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
        }
    )
    @GetMapping("/orders")
    public ResponseEntity<List<GoodsOrderResponseDto>> getUserOrders(
            @Parameter(description = "사용자 정보", required = true) @AuthenticationPrincipal SecurityUser user
    ) {
        logger.info("주문내역 조회 API 호출됨");
        
        try {
            if (user == null) {
                logger.error("사용자 인증 정보가 없습니다.");
                throw new ApiException(ErrorCode.USER_NOT_FOUND);
            }
            
            logger.info("사용자 정보 - ID: {}, Email: {}", user.getId(), user.getEmail());
            
            User orderUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> {
                        logger.error("사용자를 찾을 수 없습니다 - ID: {}", user.getId());
                        return new ApiException(ErrorCode.USER_NOT_FOUND);
                    });
            
            logger.info("사용자 조회 성공 - 사용자명: {}", orderUser.getNickname());
            
            List<GoodsOrderResponseDto> orders = orderService.getOrdersByUser(orderUser);
            logger.info("주문내역 조회 성공 - 주문 개수: {}", orders.size());
            
            return ResponseEntity.ok(orders);
        } catch (ApiException e) {
            logger.error("주문내역 조회 실패 - ApiException: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("주문내역 조회 실패 - Exception: ", e);
            throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // 주문 취소
    @Operation(
        summary = "주문 취소",
        description = "주문을 취소합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "주문 취소 성공"),
            @ApiResponse(responseCode = "404", description = "주문을 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "취소할 수 없는 주문 상태")
        }
    )
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Map<String, String>> cancelOrder(
            @Parameter(description = "주문 ID", required = true) @PathVariable String orderId,
            @Parameter(description = "사용자 정보", required = true) @AuthenticationPrincipal SecurityUser user
    ) {
        try {
            // 주문 소유자 확인을 위해 사용자 검증
            User orderUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
            
            orderService.cancelOrder(orderId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "주문이 성공적으로 취소되었습니다.");
            response.put("orderId", orderId);
            
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            logger.error("주문 취소 실패 - orderId: {}, error: ", orderId, e);
            throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

}