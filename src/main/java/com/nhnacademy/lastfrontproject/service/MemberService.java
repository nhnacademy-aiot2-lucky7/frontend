package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.member.MemberDto;
import com.nhnacademy.lastfrontproject.entity.Member;
import com.nhnacademy.lastfrontproject.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberService {
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<MemberDto> getAllMembers() {
        List<Member> entities = memberRepository.findAll();
        System.out.println("DB에서 읽은 멤버 수: " + entities.size());
        return entities.stream().map(MemberDto::fromEntity).collect(Collectors.toList());
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public void updateMember(Long id, MemberDto dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 멤버가 존재하지 않습니다: " + id));

        member.setName(dto.getName());
        member.setEmail(dto.getEmail());

        memberRepository.save(member);
    }
}
