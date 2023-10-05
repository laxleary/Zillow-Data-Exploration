SELECT DISTINCT
    data.indicator_id,
    data.region_id,
    data.date,
    data.value,
    indicators.indicator,
    indicators.category,
    regions.region_type,
    regions.region
FROM data
INNER JOIN indicators ON data.indicator_id = indicators.indicator_id
INNER JOIN regions ON data.region_id = regions.region_id
WHERE data.date BETWEEN '2010-01-01' AND '2023-12-31'
ORDER BY data.date ASC;