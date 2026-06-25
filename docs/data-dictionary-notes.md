# Data Dictionary Notes

The imported MySQL tables use legacy RETS-style column names. Always confirm the actual schema with `DESCRIBE` before writing SQL.

## `rets_property` fields used by this project

| Project meaning | MySQL column |
|---|---|
| Listing ID | `L_ListingID` |
| Address | `L_Address` |
| City | `L_City` |
| State | `L_State` |
| ZIP code | `L_Zip` |
| Price | `L_SystemPrice` |
| Bedrooms | `L_Keyword2` |
| Bathrooms | `LM_Dec_3` |
| Square feet | `LM_Int2_3` |
| Photos JSON | `L_Photos` |
| Latitude | `LMD_MP_Latitude` |
| Longitude | `LMD_MP_Longitude` |
| Remarks | `L_Remarks` |
| Year built | `YearBuilt` |
| Lot size | `LotSizeAcres` |

## `rets_openhouse` fields used by this project

| Project meaning | MySQL column |
|---|---|
| Listing ID / foreign key | `L_ListingID` |
| Open house date | `OpenHouseDate` |
| Start time | `OH_StartTime` |
| End time | `OH_EndTime` |
| JSON details / remarks | `all_data` |

The separate Trestle metadata document uses standardized RESO names such as `City`, `BedroomsTotal`, and `BathroomsTotalInteger`. Those names are useful conceptually, but they are not necessarily the names in the imported internship tables.
