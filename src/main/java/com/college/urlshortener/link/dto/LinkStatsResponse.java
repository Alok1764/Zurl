package com.college.urlshortener.link.dto;

import java.util.List;
import java.util.Map;

public record LinkStatsResponse(
        long totalClicks,
        long uniqueClicks,
        List<DailyCount> clicksByDay,
        Map<String, Long> byDevice,
        Map<String, Long> byCountry,
        List<ReferrerCount> topReferrers
) {

    public record DailyCount(String date, long count) {}

    public record ReferrerCount(String referrer, long count) {}

}
