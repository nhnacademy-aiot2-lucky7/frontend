package com.nhnacademy.blog.common.context;

import com.nhnacademy.blog.common.context.exception.BeanNotFoundException;
import com.nhnacademy.blog.common.db.BlogDataSource;
import com.nhnacademy.blog.common.db.DbProperties;
import com.nhnacademy.blog.hello.TestBeanCollection;
import com.nhnacademy.blog.hello.init.TestInit1;
import com.nhnacademy.blog.hello.init.TestInit2;
import com.nhnacademy.blog.hello.stereotype.repository.impl.JpaHelloRepository;
import com.nhnacademy.blog.hello.stereotype.repository.impl.MemoryHelloRepository;
import com.nhnacademy.blog.hello.stereotype.service.HelloService;
import com.nhnacademy.blog.hello.stereotype.service.impl.HelloServiceImpl;
import org.junit.jupiter.api.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ApplicationContextTest {

    static ApplicationContext applicationContext = ContextHolder.getApplicationContext();

    @Test
    @DisplayName("getBean() - 성공")
    @Order(1)
    void getBean() {
        Assertions.assertEquals("hello", applicationContext.getBean("msg"));
    }

    @Test
    @DisplayName("getBean() - name이 null 또는 공백 경우 IllegalArgumentException")
    @Order(2)
    void getBeanNullCheck() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.getBean(null));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.getBean(""));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.getBean("  "));
    }

    @Test
    @DisplayName("getBean() - 존재하지 않으면 BeanNotFoundException")
    @Order(3)
    void getBeanNotFound() {
        Assertions.assertThrows(BeanNotFoundException.class,
                () -> applicationContext.getBean("HelloRepository"));
    }

    @Test
    @DisplayName("registerBean() - name이 null이거나 공백인 경우 IllegalArgumentException")
    @Order(4)
    void registerBeanNullCheck() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.registerBean(null, new Object()));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.registerBean("", new Object()));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.getBean("  "));
    }

    @Test
    @DisplayName("removeBean()")
    @Order(5)
    void removeBean() {
        applicationContext.removeBean(MemoryHelloRepository.BEAN_NAME);
        Assertions.assertThrows(BeanNotFoundException.class,
                () -> applicationContext.getBean(MemoryHelloRepository.BEAN_NAME));
    }

    @Test
    @DisplayName("removeBean() - name이 null이거나 공백인 경우 IllegalArgumentException")
    @Order(6)
    void removeBeanNullCheck() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.removeBean(null));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.removeBean(""));
        Assertions.assertThrows(IllegalArgumentException.class, () -> applicationContext.getBean("  "));
    }

    @Test
    @DisplayName("InitDbPropertiesReader - db.properties 파일을 읽어 DbProperties 인스턴스를 생성한다")
    @Order(7)
    void createDbProperties() {
        DbProperties dbProperties = (DbProperties) applicationContext.getBean(DbProperties.BEAN_NAME);
        Assertions.assertEquals("jdbc:mysql://s4.java21.net:13306/nhn_academy_blog", dbProperties.getUrl());
        Assertions.assertEquals("nhn_academy_blog", dbProperties.getUsername());
        Assertions.assertEquals("Phv.GkNm5l7B_GHV", dbProperties.getPassword());
        Assertions.assertEquals(1, dbProperties.getInitialSize());
        Assertions.assertEquals(2, dbProperties.getMaxTotal());
        Assertions.assertEquals(3, dbProperties.getMaxIdle());
        Assertions.assertEquals(4, dbProperties.getMinIdle());
        Assertions.assertEquals(5, dbProperties.getMaxWait());
        Assertions.assertEquals("select 1", dbProperties.getValidationQuery());
        Assertions.assertFalse(dbProperties.isSpy());
    }

    @Test
    @DisplayName("InitDbPropertiesReader - beanMap에 DbProperties 인스턴스를 등록힌다")
    @Order(8)
    void initDbProperties() {
        Assertions.assertNotNull(applicationContext.getBean(DbProperties.BEAN_NAME));
    }

    @Test
    @DisplayName("BlogDataSource - DB 커넥션이 정상적으로 생성된다")
    @Order(9)
    void connection() throws SQLException {
        BlogDataSource blogDataSource = (BlogDataSource) applicationContext.getBean(BlogDataSource.BEAN_NAME);
        Connection connection = blogDataSource.getDataSource().getConnection();
        Assertions.assertNotNull(connection);
    }

    @Test
    @DisplayName("InitComponent - beanMap에 steteotype 인스턴스를 등록한다")
    @Order(10)
    void initComponent() {
        Assertions.assertNotNull(applicationContext.getBean(JpaHelloRepository.BEAN_NAME));
        Assertions.assertNotNull(applicationContext.getBean(HelloServiceImpl.BEAN_NAME));
    }

    @Test
    @DisplayName("ApplicationContext.initialize() - Initializable의 initialize()는 @InitOrder 순서대로 호출된다")
    @Order(11)
    void checkBeanCollection() {
        List<Object> beanList = TestBeanCollection.getBeanList();
        Assertions.assertEquals(2, beanList.size());
        Assertions.assertEquals(TestInit1.class.getSimpleName(), beanList.get(0));
        Assertions.assertEquals(TestInit2.class.getSimpleName(), beanList.get(1));
    }

    @Test
    @DisplayName("InitComponent - @Qualifier 에 명시한 인스턴스를 생성자에 주입하여 빈을 생성한다")
    @Order(12)
    void qualifier() {
        HelloService helloService = (HelloService) applicationContext.getBean("helloService");
        Assertions.assertEquals(MemoryHelloRepository.class, helloService.getRepository().getClass());
    }

}