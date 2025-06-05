package com.nhnacademy.lastfrontproject.service.impl;

import com.nhnacademy.lastfrontproject.adaptor.DashboardAdaptor;
import com.nhnacademy.lastfrontproject.adaptor.SensorAdaptor;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.CreateDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.DeleteDashboardRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.InfoDashboardResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.dashboard.UpdateDashboardNameRequest;
import com.nhnacademy.lastfrontproject.dto.grafana.folder.FolderInfoResponse;
import com.nhnacademy.lastfrontproject.dto.grafana.panel.*;
import com.nhnacademy.lastfrontproject.dto.sensor.DataTypeInfoResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.SensorDataMappingIndexResponse;
import com.nhnacademy.lastfrontproject.dto.sensor.ThresholdBoundResponse;
import com.nhnacademy.lastfrontproject.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DashboardAdaptor dashboardAdaptor;
    private final SensorAdaptor sensorAdaptor;

    public DashboardServiceImpl(DashboardAdaptor dashboardAdaptor, SensorAdaptor sensorAdaptor){
        this.dashboardAdaptor = dashboardAdaptor;
        this.sensorAdaptor = sensorAdaptor;
    }

    @Override
    public List<FolderInfoResponse> getFolders() {
        ResponseEntity<List<FolderInfoResponse>> folders = dashboardAdaptor.getFolders();
        return folders.getBody();
    }

    @Override
    public List<InfoDashboardResponse> getAllDashboard() {
        ResponseEntity<List<InfoDashboardResponse>> allDashboard = dashboardAdaptor.getAllDashboard();
        return allDashboard.getBody();
    }

    @Override
    public List<IframePanelResponse> getPanel(String dashboardUid) {
        try {
            ResponseEntity<List<IframePanelResponse>> panels = dashboardAdaptor.getPanel(dashboardUid);

            return panels.getBody();
        }catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public void createDashboard(CreateDashboardRequest createDashboardRequest) {
        dashboardAdaptor.createDashboard(createDashboardRequest);
    }

    @Override
    public List<IframePanelResponse> getFilterPanel(ReadPanelRequest readPanelRequest, List<Integer> offPanelId) {
        ResponseEntity<List<IframePanelResponse>> filterPanel = dashboardAdaptor.getFilterPanel(readPanelRequest, offPanelId);
        return filterPanel.getBody();
    }

    @Override
    public ResponseEntity<Void> createPanel(CreatePanelRequest createPanelRequest) {
        dashboardAdaptor.createPanel(createPanelRequest);
        return null;
    }

    @Override
    public void updateDashboard(UpdateDashboardNameRequest updateDashboardNameRequest) {
        dashboardAdaptor.updateDashboard(updateDashboardNameRequest);
    }

    @Override
    public void updatePanel(UpdatePanelRequest updatePanelRequest) {
        dashboardAdaptor.updatePanel(updatePanelRequest);
    }

    @Override
    public void updatePriority(UpdatePanelPriorityRequest updatePanelPriorityRequest) {
        dashboardAdaptor.updatePriority(updatePanelPriorityRequest);
    }

    @Override
    public void deleteDashboard(DeleteDashboardRequest deleteDashboardRequest) {
        dashboardAdaptor.deleteDashboard(deleteDashboardRequest);
    }

    @Override
    public void deletePanel(DeletePanelRequest deletePanelRequest) {
        dashboardAdaptor.deletePanel(deletePanelRequest);
    }

    @Override
    public Set<SensorDataMappingIndexResponse> getSensor() {
        return sensorAdaptor.getSensorData().getBody();
    }

    @Override
    public ThresholdBoundResponse getSensorBound(SensorFieldRequestDto sensorFieldRequestDto) {
        return sensorAdaptor.getSensorBound(
                sensorFieldRequestDto.getGatewayId(),
                sensorFieldRequestDto.getSensorId(),
                sensorFieldRequestDto.getField())
                .getBody();
    }

    @Override
    public DataTypeInfoResponse getDataTypeByKrName(String typeEnName) {
        return sensorAdaptor.getDataTypeKrName(typeEnName).getBody();
    }
}
