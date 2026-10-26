-- Calculated Insight Altamar_RFM (SQL del documento "Altamar RFM · Modelo de datos")
-- Antes de guardar: Check Syntax, y sustituir IndividualIdentityLink__dlm / UnifiedIndividual__dlm
-- por los nombres reales de tu ruleset de Identity Resolution (Data Explorer).

SELECT
  s.uid__c AS UnifiedIndividualId__c,
  CASE
    WHEN s.r >= 4 AND s.f >= 4 AND s.m >= 4 THEN 'Champions'
    WHEN s.f = 1 AND s.r >= 4 THEN 'Nuevos'
    WHEN s.r >= 3 AND s.f >= 2 THEN 'Leales'
    WHEN s.r <= 2 AND (s.f >= 3 OR s.m >= 3) THEN 'En riesgo'
    ELSE 'Dormidos'
  END AS RFM_Segmento__c,
  MAX(s.dias) AS RFM_Recencia_Dias__c,
  MAX(s.pedidos) AS RFM_Frecuencia__c,
  MAX(s.gasto) AS RFM_Monetario__c,
  MAX(s.r) AS RFM_R__c,
  MAX(s.f) AS RFM_F__c,
  MAX(s.m) AS RFM_M__c
FROM (
  SELECT
    a.uid__c, a.dias, a.pedidos, a.gasto,
    CASE WHEN a.dias <= 30 THEN 5 WHEN a.dias <= 90 THEN 4 WHEN a.dias <= 180 THEN 3 WHEN a.dias <= 365 THEN 2 ELSE 1 END AS r,
    CASE WHEN a.pedidos >= 8 THEN 5 WHEN a.pedidos >= 5 THEN 4 WHEN a.pedidos >= 3 THEN 3 WHEN a.pedidos = 2 THEN 2 ELSE 1 END AS f,
    CASE WHEN a.gasto > 500 THEN 5 WHEN a.gasto > 250 THEN 4 WHEN a.gasto > 120 THEN 3 WHEN a.gasto >= 60 THEN 2 ELSE 1 END AS m
  FROM (
    SELECT
      ui.ssot__Id__c AS uid__c,
      DATEDIFF(CURRENT_DATE(), MAX(poe.ssot__EngagementDateTm__c)) AS dias,
      COUNT(DISTINCT poe.ssot__SalesOrderId__c) AS pedidos,
      SUM(poe.ssot__NetOrderAmount__c) AS gasto
    FROM ssot__ProductOrderEngagement__dlm poe
    JOIN IndividualIdentityLink__dlm ul
      ON poe.ssot__IndividualId__c = ul.SourceRecordId__c
    JOIN UnifiedIndividual__dlm ui
      ON ul.UnifiedRecordId__c = ui.ssot__Id__c
    WHERE poe.ssot__EngagementDateTm__c >= DATE_SUB(CURRENT_DATE(), 730)
      AND poe.ssot__SalesOrderId__c IS NOT NULL -- solo eventos de pedido (el stream web trae todos los eventos)
    GROUP BY ui.ssot__Id__c
  ) a
) s
GROUP BY
  s.uid__c,
  CASE
    WHEN s.r >= 4 AND s.f >= 4 AND s.m >= 4 THEN 'Champions'
    WHEN s.f = 1 AND s.r >= 4 THEN 'Nuevos'
    WHEN s.r >= 3 AND s.f >= 2 THEN 'Leales'
    WHEN s.r <= 2 AND (s.f >= 3 OR s.m >= 3) THEN 'En riesgo'
    ELSE 'Dormidos'
  END
