package com.college.urlshortener.link.repository;

import com.college.urlshortener.link.model.Click;
import com.college.urlshortener.link.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {

    long countByLink(Link link);

    @Query("SELECT COUNT(DISTINCT c.ipHash) FROM Click c WHERE c.link = :link AND c.ipHash IS NOT NULL")
    long countDistinctIpHashByLink(@Param("link") Link link);

    @Query("""
            SELECT CAST(c.clickedAt AS date) AS day, COUNT(c) AS total
            FROM Click c
            WHERE c.link = :link AND c.clickedAt >= :since
            GROUP BY CAST(c.clickedAt AS date)
            ORDER BY CAST(c.clickedAt AS date)
            """)
    List<Object[]> countClicksByDay(@Param("link") Link link, @Param("since") LocalDateTime since);

    @Query("SELECT c.deviceType, COUNT(c) FROM Click c WHERE c.link = :link GROUP BY c.deviceType")
    List<Object[]> countByDevice(@Param("link") Link link);

    @Query("SELECT c.country, COUNT(c) FROM Click c WHERE c.link = :link AND c.country IS NOT NULL GROUP BY c.country")
    List<Object[]> countByCountry(@Param("link") Link link);

    @Query("SELECT c.referrer, COUNT(c) FROM Click c WHERE c.link = :link AND c.referrer IS NOT NULL GROUP BY c.referrer ORDER BY COUNT(c) DESC")
    List<Object[]> topReferrers(@Param("link") Link link);
}
