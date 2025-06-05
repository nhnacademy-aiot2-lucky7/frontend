package com.nhnacademy.blog.hello.init;

import com.nhnacademy.blog.common.annotation.InitOrder;
import com.nhnacademy.blog.common.context.Context;
import com.nhnacademy.blog.common.init.Initializeable;
import com.nhnacademy.blog.hello.TestBeanCollection;

@InitOrder(5)
public class TestInit1 implements Initializeable {
    @Override
    public void initialize(Context context) {
        context.registerBean("msg", "hello");
        TestBeanCollection.add(getClass().getSimpleName());
    }
}
