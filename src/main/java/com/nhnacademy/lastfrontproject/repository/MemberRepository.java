package com.nhnacademy.lastfrontproject.repository;

import com.nhnacademy.lastfrontproject.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}