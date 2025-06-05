package com.nhnacademy.lastfrontproject.service;

import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.dto.sensor.DataTypeInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.RuleRequest;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.ThresholdBoundResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface DashboardService {

    // 모든 폴더 조회
    List<FolderInfoResponse> getFolders();

    // 모든 대시보드 정보 조회
    List<InfoDashboardResponse> getAllDashboard();

    // 대시보드내의 모든 패널 정보 조회
    List<IframePanelResponse> getPanel(String dashboardUid);

    // 대시보드 생성
    void createDashboard(CreateDashboardRequest createDashboardRequest);

    // on인 패널만 조회
    List<IframePanelResponse> getFilterPanel(ReadPanelRequest readPanelRequest, List<Integer> offPanelId);

    // 패널 생성
    ResponseEntity<Void> createPanel(RuleRequest ruleRequest, CreatePanelRequest createPanelRequest);

    // 대시보드 수정
    void updateDashboard(UpdateDashboardNameRequest updateDashboardNameRequest);

    // 패널 수정
    void updatePanel(UpdatePanelRequest updatePanelRequest);

    // 패널 우선순위 수정
    void updatePriority(UpdatePanelPriorityRequest updatePanelPriorityRequest);

    // 대시보드 삭제
    void deleteDashboard(DeleteDashboardRequest deleteDashboardRequest);

    // 패널 삭제
    void deletePanel(DeletePanelRequest deletePanelRequest);

    Set<SensorDataMappingIndexResponse> getSensor();

    ThresholdBoundResponse getSensorBound(SensorFieldRequestDto sensorFieldRequestDto);

    DataTypeInfoResponse getDataTypeByKrName(String typeEnName);
}
