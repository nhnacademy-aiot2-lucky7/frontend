package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.DashboardAdapter;
import com.nhnacademy.lastfrontproject.adaptor.SensorAdapter;
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
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DashboardAdapter dashboardAdapter;
    private final SensorAdapter sensorAdapter;

    public DashboardServiceImpl(DashboardAdapter dashboardAdapter, SensorAdapter sensorAdapter){
        this.dashboardAdapter = dashboardAdapter;
        this.sensorAdapter = sensorAdapter;
    }

    @Override
    public List<FolderInfoResponse> getFolders() {
        ResponseEntity<List<FolderInfoResponse>> folders = dashboardAdapter.getFolders();
        return folders.getBody();
    }

    @Override
    public List<InfoDashboardResponse> getAllDashboard() {
        ResponseEntity<List<InfoDashboardResponse>> allDashboard = dashboardAdapter.getAllDashboard();
        return allDashboard.getBody();
    }

    @Override
    public List<IframePanelResponse> getPanel(String dashboardUid) {
        try {
            ResponseEntity<List<IframePanelResponse>> panels = dashboardAdapter.getPanel(dashboardUid);

            return panels.getBody();
        }catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public void createDashboard(CreateDashboardRequest createDashboardRequest) {
        dashboardAdapter.createDashboard(createDashboardRequest);
    }

    @Override
    public List<IframePanelResponse> getFilterPanel(ReadPanelRequest readPanelRequest, List<Integer> offPanelId) {
        ResponseEntity<List<IframePanelResponse>> filterPanel = dashboardAdapter.getFilterPanel(readPanelRequest, offPanelId);
        return filterPanel.getBody();
    }

    @Override
    public ResponseEntity<Void> createPanel(CreatePanelRequest createPanelRequest) {
        dashboardAdapter.createPanel(createPanelRequest);
        return null;
    }

    @Override
    public void updateDashboard(UpdateDashboardNameRequest updateDashboardNameRequest) {
        dashboardAdapter.updateDashboard(updateDashboardNameRequest);
    }

    @Override
    public void updatePanel(UpdatePanelRequest updatePanelRequest) {
        dashboardAdapter.updatePanel(updatePanelRequest);
    }

    @Override
    public void updatePriority(UpdatePanelPriorityRequest updatePanelPriorityRequest) {
        dashboardAdapter.updatePriority(updatePanelPriorityRequest);
    }

    @Override
    public void deleteDashboard(DeleteDashboardRequest deleteDashboardRequest) {
        dashboardAdapter.deleteDashboard(deleteDashboardRequest);
    }

    @Override
    public void deletePanel(DeletePanelRequest deletePanelRequest) {
        dashboardAdapter.deletePanel(deletePanelRequest);
    }

    @Override
    public Set<SensorDataMappingIndexResponse> getSensor() {
        return sensorAdapter.getSensorData().getBody();
    }

    @Override
    public ThresholdBoundResponse getSensorBound(SensorFieldRequestDto sensorFieldRequestDto) {
        return sensorAdapter.getSensorBound(
                sensorFieldRequestDto.getGatewayId(),
                sensorFieldRequestDto.getSensorId(),
                sensorFieldRequestDto.getField())
                .getBody();
    }

    @Override
    public DataTypeInfoResponse getDataTypeByKrName(String typeEnName) {
        return sensorAdapter.getDataTypeKrName(typeEnName).getBody();
    }
}
