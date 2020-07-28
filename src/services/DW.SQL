SELECT * FROM PRJ_TDE_GS_PARTNERS p WHERE p.TDE_ID= 16727
                                    AND (p.id IN (SELECT un.PARTNER_ID FROM MON_DEDA_GS_UNIT_COST_SCALE un
                                    WHERE un.DEDA_ID = 13515 
                                    OR p.id IN (SELECT fl.partnerId FROM MON_DEDA_GS_FLAT_RATE fl WHERE fl.DEDA_ID = " +13515 + )))));