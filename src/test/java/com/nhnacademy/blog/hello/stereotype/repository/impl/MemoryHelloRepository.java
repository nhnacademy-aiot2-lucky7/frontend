package com.nhnacademy.blog.hello.stereotype.repository.impl;

import com.nhnacademy.blog.common.annotation.InitOrder;
import com.nhnacademy.blog.common.annotation.stereotype.Repository;
import com.nhnacademy.blog.hello.stereotype.repository.HelloRepository;

@InitOrder(20)
@Repository(MemoryHelloRepository.BEAN_NAME)
public class MemoryHelloRepository implements HelloRepository {
    public static final String BEAN_NAME = "memoryHelloRepository";

    public MemoryHelloRepository() {
    }
}
