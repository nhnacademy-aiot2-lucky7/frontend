package com.nhnacademy.lastfrontproject.util.interceptor;

import com.nhnacademy.lastfrontproject.adaptor.AuthAdaptor;
import com.nhnacademy.lastfrontproject.dto.user.UserResponse;
import com.nhnacademy.lastfrontproject.util.holder.DepartmentContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class DepartmentIdInterceptor implements HandlerInterceptor {
    private final AuthAdaptor authAdaptor;

    public DepartmentIdInterceptor(@Lazy AuthAdaptor authAdaptor){
        this.authAdaptor = authAdaptor;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserResponse userResponse = authAdaptor.getMyInfo().getBody();

        if(userResponse == null){
            return false;
        }

        DepartmentContextHolder.setDepartmentId(userResponse.getDepartment().getDepartmentId());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        DepartmentContextHolder.clear();
    }
}
