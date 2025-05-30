package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;

import java.util.List;

public interface DashboardService {

    // 모든 폴더 조회
    List<FolderInfoResponse> getFolders();

    // 모든 대시보드명 조회
    List<String> getDashboardName(String encryptedUserId);

    // 모든 대시보드 정보 조회
    List<InfoDashboardResponse> getAllDashboard(String encryptedUserId);

    // 대시보드내의 모든 패널 정보 조회
    List<IframePanelResponse> getPanel(ReadPanelRequest readPanelRequest);

    // 대시보드 생성
    void createDashboard(String encryptedUserId, CreateDashboardRequest createDashboardRequest);

    // on인 패널만 조회
    List<IframePanelResponse> getFilterPanel(ReadPanelRequest readPanelRequest, List<Integer> offPanelId);

    // 패널 생성
    void createPanel(String encryptedUserId, CreatePanelRequest createPanelRequest);

    // 대시보드 수정
    void updateDashboard(String encryptedUserId, UpdateDashboardNameRequest updateDashboardNameRequest);

    // 패널 수정
    void updatePanel(String encryptedUserId, UpdatePanelRequest updatePanelRequest);

    // 패널 우선순위 수정
    void updatePriority(String encryptedUserId, UpdatePanelPriorityRequest updatePanelPriorityRequest);

    // 대시보드 삭제
    void deleteDashboard(String encryptedUserId, DeleteDashboardRequest deleteDashboardRequest);

    // 패널 삭제
    void deletePanel(String encryptedUserId, DeletePanelRequest deletePanelRequest);
}
