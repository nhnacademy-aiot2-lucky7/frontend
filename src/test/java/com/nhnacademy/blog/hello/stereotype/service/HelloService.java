package com.nhnacademy.blog.hello.stereotype.service;

import com.nhnacademy.blog.common.annotation.stereotype.Service;
import com.nhnacademy.blog.hello.stereotype.repository.HelloRepository;

public interface HelloService {
    HelloRepository getRepository();
}
