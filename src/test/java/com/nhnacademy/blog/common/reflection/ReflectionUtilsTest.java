package com.nhnacademy.blog.common.reflection;

import com.nhnacademy.blog.common.annotation.stereotype.Repository;
import com.nhnacademy.blog.common.db.DbProperties;
import com.nhnacademy.blog.common.init.Initializeable;
import com.nhnacademy.blog.common.init.impl.InitComponent;
import com.nhnacademy.blog.common.init.impl.InitDbPropertiesReader;
import com.nhnacademy.blog.common.reflection.exception.ReflectionException;
import com.nhnacademy.blog.hello.TestClass;
import com.nhnacademy.blog.hello.stereotype.repository.impl.JpaHelloRepository;
import com.nhnacademy.blog.hello.stereotype.repository.impl.MemoryHelloRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.util.List;

@Slf4j
class ReflectionUtilsTest {

    TestClass testClass;

    @BeforeEach
    void setUp() {
        testClass = new TestClass();
    }

    @Test
    @DisplayName("setField - private 필드 값을 변경할 수 있다")
    void setField() {
        ReflectionUtils.setField(testClass, "name", "nhnacademy");
        Assertions.assertEquals("nhnacademy", testClass.getName());
    }

    @Test
    @DisplayName("setField - 필드가 존재하지 않을 경우 ReflectionException")
    void setField_exception() {
        Assertions.assertThrows(ReflectionException.class,
                () -> ReflectionUtils.setField(testClass, "age", "nhnacademy"));
    }

    @Test
    @DisplayName("classScan - 오름차순으로 정렬하여 반환한다")
    void classScan() {
        List<ClassWrapper<Initializeable>> classWrappers = ReflectionUtils.classScan("com.nhnacademy.blog", Initializeable.class);
        Assertions.assertNotNull(classWrappers);
        Assertions.assertEquals(4, classWrappers.size());
        Assertions.assertEquals(InitDbPropertiesReader.class, classWrappers.get(0).getClazz());
        Assertions.assertEquals(InitComponent.class, classWrappers.get(1).getClazz());
    }

    @Test
    @DisplayName("classSacnByAnnotated - 오름차순으로 정렬하여 반환한다")
    void classScanByAnnotatedOrder() {
        List<ClassWrapper> classWrappers = ReflectionUtils.classScanByAnnotated("com.nhnacademy.blog.hello", Repository.class);
        Assertions.assertNotNull(classWrappers);
        Assertions.assertEquals(2, classWrappers.size());
        Assertions.assertEquals(JpaHelloRepository.class, classWrappers.get(0).getClazz());
        Assertions.assertEquals(MemoryHelloRepository.class, classWrappers.get(1).getClazz());
    }

    @Test
    @DisplayName("findFirstConstructor 구현")
    void findFirstConstructor() {
        Constructor<Object> constructor = ReflectionUtils.findFirstConstructor(DbProperties.class);
        Assertions.assertNotNull(constructor);
        Assertions.assertEquals(11, constructor.getParameterCount());
    }

}