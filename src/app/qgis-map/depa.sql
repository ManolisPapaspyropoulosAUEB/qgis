SELECT PROJECT_ID, YEAR, QUARTER,
        SUM(ELIG_PUB_BUDGET) AS ELIG_PUB_BUDGET,
        SUM(VERIFIED_EXPENSES) AS VERIFIED_EXPENSES,
        SUM(SUBMITTED_EXPENSES) AS SUBMITTED_EXPENSES,
        SUM(IMPUTATIONS_AMOUNT) AS IMPUTATIONS_AMOUNT,
        SUM(REAL_EXPENSES) AS REAL_EXPENSES,
        SUM(SCHEDULED_EXPENSES) AS SCHEDULED_EXPENSES
        FROM        
        (SELECT depa.PROJECT_ID AS PROJECT_ID,
                depa_node_exp.YEAR AS YEAR,
                depa_node_exp.QUARTER AS QUARTER,
                SUM(depa_node_exp.ELIG_PUB_BUDGET) AS ELIG_PUB_BUDGET,
                SUM(depa_node_exp.VERIFIED_EXPENSES) AS VERIFIED_EXPENSES,
                SUM(depa_node_exp.SUBMITTED_EXPENSES) AS SUBMITTED_EXPENSES,
                SUM(depa_node_exp.IMPUTATIONS_AMOUNT) AS IMPUTATIONS_AMOUNT,
                SUM(depa_node_exp.REAL_EXPENSES) AS REAL_EXPENSES,
                SUM(depa_node_exp.SCHEDULED_EXPENSES) AS SCHEDULED_EXPENSES
                FROM MON_DEPA_NODE_EXPENSES depa_node_exp,
                MON_DEPA depa
                WHERE depa.ID = depa_node_exp.DEPA_ID
                AND depa.PROJECT_ID = 24088
                AND depa_node_exp.NODE_TYPE = 1
                GROUP BY depa.PROJECT_ID, depa_node_exp.YEAR, depa_node_exp.QUARTER
        UNION
        --8a ypologisei ta posa programmatismenwn node mono ean den exoun ekdo8ei
        SELECT depa.PROJECT_ID AS PROJECT_ID,
                depa_node_exp.YEAR AS YEAR,
                depa_node_exp.QUARTER AS QUARTER,
                SUM(depa_node_exp.ELIG_PUB_BUDGET) AS ELIG_PUB_BUDGET,
                SUM(0) AS VERIFIED_EXPENSES,
                SUM(0) AS SUBMITTED_EXPENSES,
                SUM(0) AS IMPUTATIONS_AMOUNT,
                SUM(0) REAL_EXPENSES,
                SUM(depa_node_exp.SCHEDULED_EXPENSES) AS SCHEDULED_EXPENSES
                FROM MON_DEPA_NODE_EXPENSES depa_node_exp,
                MON_DEPA depa,
                PRJ_TDE_NODE tdeNode
                WHERE depa.ID = depa_node_exp.DEPA_ID
                AND depa.PROJECT_ID = 24088
                AND depa_node_exp.NODE_TYPE = 2
                AND tdeNode.TDE_ID = depa.TDE_ID
                AND depa_node_exp.NODE_ID = tdeNode.ID
                AND tdeNode.MON_NODE_AA IS NULL
                AND tdeNode.TO_IMPLEMENT = 1
                GROUP BY depa.PROJECT_ID, depa_node_exp.YEAR, depa_node_exp.QUARTER
        UNION
        --8a ypologisei ta posa programmatismenwn node pou exoun ekdo8ei alla den exoun epikyrw8ei (mono gia version 1, alliws 8ewreitai epikyrwmeni)
        SELECT depa.PROJECT_ID AS PROJECT_ID,
                depa_node_exp.YEAR AS YEAR,
                depa_node_exp.QUARTER AS QUARTER,
                SUM(depa_node_exp.ELIG_PUB_BUDGET) AS ELIG_PUB_BUDGET,
                SUM(0) AS VERIFIED_EXPENSES,
                SUM(0) AS SUBMITTED_EXPENSES,
                SUM(0) AS IMPUTATIONS_AMOUNT,
                SUM(0) REAL_EXPENSES,
                SUM(depa_node_exp.SCHEDULED_EXPENSES) AS SCHEDULED_EXPENSES
                FROM MON_DEPA_NODE_EXPENSES depa_node_exp,
                MON_DEPA depa,
                PRJ_TDE_NODE tdeNode,
                MON_NODE node
                WHERE depa.ID = depa_node_exp.DEPA_ID
                AND depa.PROJECT_ID = 24088
                AND depa_node_exp.NODE_TYPE = 2
                AND tdeNode.TDE_ID = depa.TDE_ID
                AND depa_node_exp.NODE_ID = tdeNode.ID
                AND tdeNode.MON_NODE_AA = node.AA
                AND node.STATUS != 'VERIFIED'
                AND node.VERSION = 1
                GROUP BY depa.PROJECT_ID, depa_node_exp.YEAR, depa_node_exp.QUARTER
        UNION
                SELECT depa.PROJECT_ID AS PROJECT_ID,
                depa_node_exp.YEAR AS YEAR,
                depa_node_exp.QUARTER AS QUARTER,
                SUM(0) AS ELIG_PUB_BUDGET,
                SUM(0) AS VERIFIED_EXPENSES,
                SUM(0) AS SUBMITTED_EXPENSES,
                SUM(0) AS IMPUTATIONS_AMOUNT,
                SUM(0) AS REAL_EXPENSES,
                SUM(depa_node_exp.SCHEDULED_EXPENSES) AS SCHEDULED_EXPENSES
                FROM MON_DEPA_NODE_EXPENSES depa_node_exp,
                MON_DEPA depa
                WHERE depa.ID = depa_node_exp.DEPA_ID
                AND depa.PROJECT_ID = 24088
                AND depa_node_exp.NODE_TYPE = 3
                GROUP BY depa.PROJECT_ID, depa_node_exp.YEAR, depa_node_exp.QUARTER        
        )
        GROUP BY PROJECT_ID, YEAR, QUARTER
        ORDER BY YEAR, QUARTER;