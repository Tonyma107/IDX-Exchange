const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse and validate an integer query parameter.
 */
function parseInteger(value, name, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, defaultValue } = options;

  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new Error(`${name} must be a valid integer`);
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }

  return parsed;
}

/**
 * Parse and validate a decimal query parameter.
 */
function parseDecimal(value, name, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER } = options;

  if (value === undefined) {
    return undefined;
  }

  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    !/^\d+(\.\d+)?$/.test(value)
  ) {
    throw new Error(`${name} must be a valid number`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }

  return parsed;
}

router.get("/", async (req, res) => {
  try {
    const limit = parseInteger(req.query.limit, "limit", {
      min: 1,
      max: MAX_LIMIT,
      defaultValue: DEFAULT_LIMIT,
    });

    const offset = parseInteger(req.query.offset, "offset", {
      min: 0,
      defaultValue: 0,
    });

    const minPrice = parseInteger(req.query.minPrice, "minPrice", {
      min: 0,
    });

    const maxPrice = parseInteger(req.query.maxPrice, "maxPrice", {
      min: 0,
    });

    const beds = parseInteger(req.query.beds, "beds", {
      min: 0,
    });

    const baths = parseDecimal(req.query.baths, "baths", {
      min: 0,
    });

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        error: "minPrice cannot be greater than maxPrice",
      });
    }

    const conditions = [];
    const filterValues = [];

    if (req.query.city !== undefined) {
      if (typeof req.query.city !== "string") {
        return res.status(400).json({
          error: "city must be a single value",
        });
      }

      const city = req.query.city.trim();

      if (city.length === 0 || city.length > 50) {
        return res.status(400).json({
          error: "city must contain between 1 and 50 characters",
        });
      }

      conditions.push("LOWER(TRIM(L_City)) = ?");
      filterValues.push(city.toLowerCase());
    }

    if (req.query.zipcode !== undefined) {
      if (typeof req.query.zipcode !== "string") {
        return res.status(400).json({
          error: "zipcode must be a single value",
        });
      }

      const zipcode = req.query.zipcode.trim();

      if (
        zipcode.length === 0 ||
        zipcode.length > 20 ||
        !/^[A-Za-z0-9 -]+$/.test(zipcode)
      ) {
        return res.status(400).json({
          error: "zipcode must be a valid postal code",
        });
      }

      conditions.push("L_Zip = ?");
      filterValues.push(zipcode);
    }

    if (minPrice !== undefined) {
      conditions.push("L_SystemPrice >= ?");
      filterValues.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push("L_SystemPrice <= ?");
      filterValues.push(maxPrice);
    }

    // beds=3 means 3 or more bedrooms.
    if (beds !== undefined) {
      conditions.push("L_Keyword2 >= ?");
      filterValues.push(beds);
    }

    // baths=2 means 2 or more bathrooms.
    if (baths !== undefined) {
      conditions.push("LM_Dec_3 >= ?");
      filterValues.push(baths);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countSql = `
      SELECT COUNT(*) AS total
      FROM rets_property
      ${whereClause}
    `;

    const propertiesSql = `
      SELECT
        L_ListingID,
        L_Address,
        L_City,
        L_State,
        L_Zip,
        L_SystemPrice,
        L_Keyword2,
        LM_Dec_3,
        LM_Int2_3,
        L_Photos
      FROM rets_property
      ${whereClause}
      ORDER BY L_ListingID
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    /*
     * Important:
     * The count query receives only filter values.
     * The properties query receives the same filters, followed by limit and offset.
     *
     * Using a copied array prevents pagination values from accidentally changing
     * the count query parameters.
     */

    const countValues = [...filterValues];
    const propertiesValues = [...filterValues];

    const [countRows] = await pool.execute(countSql, countValues);
    const [properties] = await pool.execute(
      propertiesSql,
      propertiesValues
    );

    return res.status(200).json({
      total: Number(countRows[0].total),
      limit,
      offset,
      results: properties,
    });
  } catch (error) {
    if (
      error.message.includes("must be") ||
      error.message.includes("cannot be")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("Property search failed:", error);

    return res.status(500).json({
      error: "Unable to retrieve properties",
    });
  }
});

module.exports = router;