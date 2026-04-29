package com.college.urlshortener.globalCounter.service;

import com.college.urlshortener.globalCounter.dto.GlobalCounterResponse;
import com.college.urlshortener.globalCounter.model.GlobalStats;
import com.college.urlshortener.globalCounter.repository.GlobalStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.LongAdder;

@Service
@RequiredArgsConstructor
@Slf4j
public class GlobalCounterService {

    private final GlobalStatsRepository globalStatsRepository;

    private final LongAdder redirectCounter =new LongAdder();

    @Cacheable(value="globalCount",key = "'global'")
    public GlobalCounterResponse getGlobalCounter(){
        GlobalStats globalStats=globalStatsRepository.findById(1)
                .orElseThrow(()-> new RuntimeException("Global counter is down"));

        return GlobalCounterResponse.builder()
                .totalLinksCreated(globalStats.getTotalLinksCreated())
                .totalRedirects(globalStats.getTotalRedirects())
                .build();

    }

    public void incrementRedirect() {
        redirectCounter.increment();
    }

    // to start new transaction
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementLinks() {
        globalStatsRepository.incrementLinks();
    }

    private final AtomicBoolean flushing = new AtomicBoolean(false);

    @Scheduled(fixedRate = 30000)
    public void flushRedirects() {

        if (!flushing.compareAndSet(false, true)) {
            log.warn("Flush skipped: already running");
            return;
        }

        try {
            long count = redirectCounter.sum();

            if (count == 0) {
                log.debug("Flush skipped: no pending redirects");
                return;
            }

            log.info("Flushing {} redirects", count);

            globalStatsRepository.incrementRedirectStats(count);

            redirectCounter.add(-count);

            log.info("Flush successful: {} redirects persisted", count);

        } catch (Exception e) {
            log.error("Flush failed", e);
        } finally {
            flushing.set(false);
        }
    }


}
