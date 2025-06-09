package com.nhnacademy.lastfrontproject.dto.grafana.panel;

import com.nhnacademy.lastfrontproject.dto.sensor.RuleRequest;
import lombok.Getter;

@Getter
public class UpdatePanelWithRuleRequest
{
    private UpdatePanelRequest updatePanelRequest;
    private RuleRequest ruleRequest;
}
