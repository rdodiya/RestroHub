package com.restroly.qrmenu.subscription.aspect;

import com.restroly.qrmenu.subscription.annotation.RequiresFeature;
import com.restroly.qrmenu.subscription.service.SubscriptionValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class SubscriptionFeatureAspect {

    private final SubscriptionValidationService validationService;

    @Before("@annotation(requiresFeature)")
    public void checkFeatureAccess(JoinPoint joinPoint, RequiresFeature requiresFeature) {
        Long restaurantId = resolveRestaurantId(joinPoint, requiresFeature.restaurantIdParam());

        if (restaurantId == null) {
            log.warn("Could not resolve restaurantId from param '{}', skipping feature check.",
                    requiresFeature.restaurantIdParam());
            return;
        }

        log.debug("Checking feature {} for restaurantId={}", requiresFeature.value(), restaurantId);
        validationService.validateFeatureAccess(restaurantId, requiresFeature.value());
    }

    private Long resolveRestaurantId(JoinPoint joinPoint, String paramName) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Parameter[] parameters = method.getParameters();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < parameters.length; i++) {
            Parameter param = parameters[i];

            // Match by Java parameter name
            if (param.getName().equals(paramName)) {
                return toLong(args[i]);
            }

            // Match by @PathVariable name
            PathVariable pv = param.getAnnotation(PathVariable.class);
            if (pv != null && (pv.value().equals(paramName) || pv.name().equals(paramName))) {
                return toLong(args[i]);
            }

            // Match by @RequestParam name
            RequestParam rp = param.getAnnotation(RequestParam.class);
            if (rp != null && (rp.value().equals(paramName) || rp.name().equals(paramName))) {
                return toLong(args[i]);
            }
        }

        return null;
    }

    private Long toLong(Object value) {
        if (value instanceof Long l) return l;
        if (value instanceof Integer i) return i.longValue();
        if (value instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }
}