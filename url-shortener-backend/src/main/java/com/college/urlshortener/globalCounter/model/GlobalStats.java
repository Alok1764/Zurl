package com.college.urlshortener.globalCounter.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "global_stats")
public class GlobalStats {


    @Id
    private Integer id;


    @Column(name = "total_redirects", nullable = false)
    private Long totalRedirects;

    @Column(name = "total_links_created", nullable = false)
    private Long totalLinksCreated ;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}