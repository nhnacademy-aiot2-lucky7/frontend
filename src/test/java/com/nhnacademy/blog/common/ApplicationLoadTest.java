package com.nhnacademy.blog.common;

import com.nhnacademy.blog.common.context.ApplicationContext;
import com.nhnacademy.blog.common.context.ContextHolder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ApplicationLoadTest {

    static ApplicationContext applicationContext = ContextHolder.getApplicationContext();

    @Test
    @DisplayName("ApplicationContext 생성")
    void loadApplicationContext() {
    }
}
