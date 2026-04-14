package com.college.urlshortener.link.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "clicks",
        indexes = @Index(name = "idx_link_clicked", columnList = "link_id, clicked_at")
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "link_id", nullable = false)
    private Link link;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime clickedAt = LocalDateTime.now();

    @Column(length = 64)
    private String ipHash;

    @Column(length = 2)
    private String country;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String city;

    @Column(length = 10)
    private String deviceType;

    @Column(length = 50)
    private String browser;

    @Column(length = 2048)
    private String referrer;
}
