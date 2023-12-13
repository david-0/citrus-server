# SQL Queries

## Bestellungen pro Artikel und Ort:
select  s.id, sum(i.quantity) from order_item i join "order" o on o.id = i."orderId" join location l on l.id = o."locationId" join article_stock s on s."locationId" = l.id and i."articleId" = s."articleId" group by s.id order by s.id;

## Sichtbare Lagerbestände
select a.description as article, l.description as location, s.quantity, s."reservedQuantity"  from article_stock s join article a on a.id = s."articleId" join location l on l.id = s."locationId" where s.visible='t' order by s."locationId", s."articleId";


## Abweichung auf Lagerbeständen anzeigen
select a.description as article, l.description as location, s.quantity, s."reservedQuantity", oi.orderedQuantity, s."reservedQuantity" - oi.orderedQuantity as Abweichung from article_stock s join article a on a.id = s."articleId" join location l on l.id = s."locationId" 
    join (select  s.id, sum(i.quantity) as orderedQuantity from order_item i join "order" o on o.id = i."orderId" join location l on l.id = o."locationId" join article_stock s on s."locationId" = l.id and i."articleId" = s."articleId" group by s.id order by s.id) oi on oi.id=s.id
    where s.visible='t' order by s."locationId", s."articleId";

## Lagerbestände den Bestellungen anpassen
start transaction
### Werte anpassen
update article_stock s
set "reservedQuantity" = orderedQuantity
from (select  s.id, sum(i.quantity) as orderedQuantity from order_item i join "order" o on o.id = i."orderId" join location l on l.id = o."locationId" join article_stock s on s."locationId" = l.id and i."articleId" = s."articleId" group by s.id order by s.id) oi 
where oi.id = s.id;

### überprüfen
select a.description as article, l.description as location, s.quantity, s."reservedQuantity", oi.orderedQuantity, s."reservedQuantity" - oi.orderedQuantity as Abweichung from article_stock s join article a on a.id = s."articleId" join location l on l.id = s."locationId" 
    join (select  s.id, sum(i.quantity) as orderedQuantity from order_item i join "order" o on o.id = i."orderId" join location l on l.id = o."locationId" join article_stock s on s."locationId" = l.id and i."articleId" = s."articleId" group by s.id order by s.id) oi on oi.id=s.id
    where s.visible='t' order by s."locationId", s."articleId";

Wenn ok, dann
commit transaction

## Abweichungen vor Reset
citrus=# select a.description as article, l.description as location, s.quantity, s."reservedQuantity", oi.orderedQuantity, s."reservedQuantity" - oi.orderedQuantity as Abweichung from article_stock s join article a on a.id = s."articleId" join location l on l.id = s."locationId" 
    join (select  s.id, sum(i.quantity) as orderedQuantity from order_item i join "order" o on o.id = i."orderId" join location l on l.id = o."locationId" join article_stock s on s."locationId" = l.id and i."articleId" = s."articleId" group by s.id order by s.id) oi on oi.id=s.id
    where s.visible='t' order by s."locationId", s."articleId";
      article      |       location        | quantity | reservedQuantity | orderedquantity | abweichung 
-------------------+-----------------------+----------+------------------+-----------------+------------
 Orangen           | Obfelden              |     30.0 |             18.0 |            18.0 |        0.0
 Zitronen          | Obfelden              |     20.0 |             11.0 |            11.0 |        0.0
 Gelbe Grapefruits | Obfelden              |     10.0 |              3.0 |             3.0 |        0.0
 Rote Grapefruits  | Obfelden              |     10.0 |              5.0 |             5.0 |        0.0
 Clementinen       | Obfelden              |     40.0 |             25.0 |            25.0 |        0.0
 Avocados          | Obfelden              |     30.0 |             24.0 |            24.0 |        0.0
 Orangen           | Schwellbrunn          |     80.0 |             39.0 |            31.0 |        8.0
 Zitronen          | Schwellbrunn          |     30.0 |              4.5 |             3.5 |        1.0
 Gelbe Grapefruits | Schwellbrunn          |     20.0 |              1.0 |             1.0 |        0.0
 Rote Grapefruits  | Schwellbrunn          |     30.0 |              7.0 |             7.0 |        0.0
 Clementinen       | Schwellbrunn          |     50.0 |             23.0 |            18.0 |        5.0
 Avocados          | Schwellbrunn          |    100.0 |             33.0 |            28.0 |        5.0
 Orangen           | Herisau               |    120.0 |            102.0 |            57.0 |       45.0
 Zitronen          | Herisau               |     20.0 |             10.5 |             6.5 |        4.0
 Gelbe Grapefruits | Herisau               |     20.0 |              7.0 |             4.0 |        3.0
 Rote Grapefruits  | Herisau               |     50.0 |             28.0 |            15.0 |       13.0
 Clementinen       | Herisau               |    120.0 |             99.0 |            47.0 |       52.0
 Avocados          | Herisau               |     80.0 |             47.0 |            26.0 |       21.0
 Orangen           | Volketswil            |    100.0 |             32.0 |            32.0 |        0.0
 Zitronen          | Volketswil            |     20.0 |              6.5 |             6.5 |        0.0
 Gelbe Grapefruits | Volketswil            |     30.0 |              5.0 |             5.0 |        0.0
 Rote Grapefruits  | Volketswil            |     30.0 |              7.0 |             7.0 |        0.0
 Clementinen       | Volketswil            |    120.0 |             12.0 |            12.0 |        0.0
 Avocados          | Volketswil            |    100.0 |              4.0 |             4.0 |        0.0
 Orangen           | Zizers                |     30.0 |             23.0 |            18.0 |        5.0
 Zitronen          | Zizers                |     20.0 |              8.0 |             5.0 |        3.0
 Gelbe Grapefruits | Zizers                |     10.0 |              2.0 |             2.0 |        0.0
 Rote Grapefruits  | Zizers                |     10.0 |              3.0 |             3.0 |        0.0
 Clementinen       | Zizers                |     20.0 |              5.0 |             5.0 |        0.0
 Avocados          | Zizers                |     30.0 |             23.0 |            13.0 |       10.0
 Orangen           | Frauenfeld Schümperli |    350.0 |            303.0 |           150.0 |      153.0
 Zitronen          | Frauenfeld Schümperli |     70.0 |             45.5 |            20.5 |       25.0
 Gelbe Grapefruits | Frauenfeld Schümperli |     60.0 |             47.0 |            20.0 |       27.0
 Rote Grapefruits  | Frauenfeld Schümperli |    100.0 |             82.0 |            43.0 |       39.0
 Clementinen       | Frauenfeld Schümperli |    240.0 |            188.0 |            97.0 |       91.0
 Avocados          | Frauenfeld Schümperli |    200.0 |            170.0 |           103.0 |       67.0

In Schwellbrunn(orderId=1057) und Zizers(orderId=1068) können die Abweichungen einer kompletten Bestellungen zugeordnet werden.