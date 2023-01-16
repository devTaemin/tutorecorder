package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Conference extends BaseEntity{

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "conference_category")
    private ConferenceCategory conferenceCategory;
    LocalDateTime call_start_time;
    LocalDateTime call_end_time;
    String thumbnail_url;
    String title;
    String description;
    Boolean is_active;

}
