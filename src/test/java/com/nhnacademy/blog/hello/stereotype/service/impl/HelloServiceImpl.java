package com.nhnacademy.blog.hello.stereotype.service.impl;

import com.nhnacademy.blog.common.annotation.Qualifier;
import com.nhnacademy.blog.common.annotation.stereotype.Service;
import com.nhnacademy.blog.hello.stereotype.repository.HelloRepository;
import com.nhnacademy.blog.hello.stereotype.repository.impl.MemoryHelloRepository;
import com.nhnacademy.blog.hello.stereotype.service.HelloService;

@Service(HelloServiceImpl.BEAN_NAME)
public class HelloServiceImpl implements HelloService {

    public static final String BEAN_NAME = "helloService";
    private final HelloRepository helloRepository;

    public HelloServiceImpl(@Qualifier(MemoryHelloRepository.BEAN_NAME) HelloRepository helloRepository) {
        this.helloRepository = helloRepository;
    }

    public HelloRepository getRepository() {
        return helloRepository;
    }
}
