package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.DashboardAdapter;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DashboardAdapter dashboardAdapter;

    public DashboardServiceImpl(DashboardAdapter dashboardAdapter){
        this.dashboardAdapter = dashboardAdapter;
    }

    @Override
    public List<FolderInfoResponse> getFolders() {
        ResponseEntity<List<FolderInfoResponse>> folders = dashboardAdapter.getFolders();
        return folders.getBody();
    }

    @Override
    public List<String> getDashboardName(String encryptedUserId) {
        ResponseEntity<List<String>> dashboardNames = dashboardAdapter.getDashboardName(encryptedUserId);
        return dashboardNames.getBody();
    }

    @Override
    public List<InfoDashboardResponse> getAllDashboard(String encryptedUserId) {
        ResponseEntity<List<InfoDashboardResponse>> allDashboard = dashboardAdapter.getAllDashboard(encryptedUserId);
        return allDashboard.getBody();
    }

    @Override
    public List<IframePanelResponse> getPanel(ReadPanelRequest readPanelRequest) {
        ResponseEntity<List<IframePanelResponse>> panels = dashboardAdapter.getPanel(readPanelRequest);
        return panels.getBody();
    }

    @Override
    public void createDashboard(String encryptedUserId, CreateDashboardRequest createDashboardRequest) {
        dashboardAdapter.createDashboard(encryptedUserId, createDashboardRequest);
    }

    @Override
    public List<IframePanelResponse> getFilterPanel(ReadPanelRequest readPanelRequest, List<Integer> offPanelId) {
        ResponseEntity<List<IframePanelResponse>> filterPanel = dashboardAdapter.getFilterPanel(readPanelRequest, offPanelId);
        return filterPanel.getBody();
    }

    @Override
    public void createPanel(String encryptedUserId, CreatePanelRequest createPanelRequest) {
        dashboardAdapter.createPanel(encryptedUserId, createPanelRequest);
    }

    @Override
    public void updateDashboard(String encryptedUserId, UpdateDashboardNameRequest updateDashboardNameRequest) {
        dashboardAdapter.updateDashboard(encryptedUserId, updateDashboardNameRequest);
    }

    @Override
    public void updatePanel(String encryptedUserId, UpdatePanelRequest updatePanelRequest) {
        dashboardAdapter.updatePanel(encryptedUserId, updatePanelRequest);
    }

    @Override
    public void updatePriority(String encryptedUserId, UpdatePanelPriorityRequest updatePanelPriorityRequest) {
        dashboardAdapter.updatePriority(encryptedUserId, updatePanelPriorityRequest);
    }

    @Override
    public void deleteDashboard(String encryptedUserId, DeleteDashboardRequest deleteDashboardRequest) {
        dashboardAdapter.deleteDashboard(encryptedUserId, deleteDashboardRequest);
    }

    @Override
    public void deletePanel(String encryptedUserId, DeletePanelRequest deletePanelRequest) {
        dashboardAdapter.deletePanel(encryptedUserId, deletePanelRequest);
    }
}
