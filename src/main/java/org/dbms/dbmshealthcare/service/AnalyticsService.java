package org.dbms.dbmshealthcare.service;

import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.dbms.dbmshealthcare.dto.analytics.AgeDistributionDto;
import org.dbms.dbmshealthcare.dto.analytics.AnalyticsFilterDto;
import org.dbms.dbmshealthcare.dto.analytics.SpecialtyStatsDto;
import org.dbms.dbmshealthcare.dto.analytics.TopDoctorsDto;
import org.dbms.dbmshealthcare.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

  private final AnalyticsRepository analyticsRepository;

  public List<TopDoctorsDto> getTopDoctors(AnalyticsFilterDto filter) {
    YearMonth yearMonth = YearMonth.of(filter.year(), filter.month());
    return analyticsRepository.getTopDoctors(yearMonth);
  }

  public List<SpecialtyStatsDto> getSpecialtyStats(AnalyticsFilterDto filter) {
    YearMonth yearMonth = YearMonth.of(filter.year(), filter.month());
    return analyticsRepository.getSpecialtyStats(yearMonth);  }

  public List<AgeDistributionDto> getAgeDistribution() {
    return analyticsRepository.getAgeDistribution();
  }
}
