package com.nhnacademy.blog.hello.stereotype.repository.impl;

import com.nhnacademy.blog.common.annotation.InitOrder;
import com.nhnacademy.blog.common.annotation.stereotype.Repository;
import com.nhnacademy.blog.hello.stereotype.repository.HelloRepository;

@InitOrder(10)
@Repository(JpaHelloRepository.BEAN_NAME)
public class JpaHelloRepository implements HelloRepository {
    public static final String BEAN_NAME = "jpaHelloRepository";

    public JpaHelloRepository(){}
}
