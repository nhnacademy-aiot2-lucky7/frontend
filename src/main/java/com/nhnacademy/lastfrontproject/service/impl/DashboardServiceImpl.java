package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.DashboardAdapter;
import com.nhnacademy.lastfrontproject.adaptor.SensorAdapter;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
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
        ReadPanelRequest readPanelRequest = new ReadPanelRequest(dashboardUid);
        ResponseEntity<List<IframePanelResponse>> panels = dashboardAdapter.getPanel(readPanelRequest);
        return panels.getBody();
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
    public void createPanel(CreatePanelRequest createPanelRequest) {
        dashboardAdapter.createPanel(createPanelRequest);
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
}
