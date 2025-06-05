package com.nhnacademy.lastfrontproject.dto.grafana.panel;

import com.nhnacademy.lastfrontproject.dto.sensor.RuleRequest;
import lombok.Getter;

@Getter
public class PanelWithRuleRequest {

    private CreatePanelRequest createPanelRequest;
    private RuleRequest ruleRequest;
}