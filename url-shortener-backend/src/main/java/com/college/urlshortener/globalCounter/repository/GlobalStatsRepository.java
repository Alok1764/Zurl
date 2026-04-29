package com.college.urlshortener.globalCounter.repository;

import com.college.urlshortener.globalCounter.model.GlobalStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface GlobalStatsRepository extends JpaRepository<GlobalStats,Integer> {


    Optional<GlobalStats> findById(Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE GlobalStats g SET g.totalRedirects = g.totalRedirects + :count WHERE g.id = 1")
    void incrementRedirectStats(@Param("count") long count);

    @Modifying
    @Query("UPDATE GlobalStats g SET g.totalLinksCreated = g.totalLinksCreated + 1 WHERE g.id = 1")
    void incrementLinks();
}
