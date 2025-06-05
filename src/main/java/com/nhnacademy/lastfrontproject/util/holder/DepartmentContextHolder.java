package com.nhnacademy.lastfrontproject.util.holder;

public class DepartmentContextHolder {
    private static final ThreadLocal<String> departmentId = new ThreadLocal<>();

    public static void setDepartmentId(String id){
        departmentId.set(id);
    }

    public static String getDepartmentId(){
        return departmentId.get();
    }

    public static void clear(){
        departmentId.remove();
    }
}
