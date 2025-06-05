package com.nhnacademy.blog.hello;

import java.util.ArrayList;
import java.util.List;

public class TestBeanCollection {

    private static List<Object> beanList = new ArrayList<>();

    public static void add(Object object) {
        beanList.add(object);
    }

    public static List<Object> getBeanList() {
        return beanList;
    }

}
