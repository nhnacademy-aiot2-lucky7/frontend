package com.nhnacademy.lastfrontproject.dto.grafana.folder;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FolderInfoResponse {

    @JsonProperty("id")
    private int folderId;

    @JsonProperty("uid")
    private String folderUid;

    @JsonProperty("title")
    private String folderTitle;
}