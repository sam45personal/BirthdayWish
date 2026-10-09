import React, { useMemo } from "react";

const CANDLES = [
  { id: 1, x: 100, y: 150, h: 56 },
  { id: 2, x: 140, y: 141, h: 64 },
  { id: 3, x: 180, y: 137, h: 74 },
  { id: 4, x: 220, y: 141, h: 64 },
  { id: 5, x: 260, y: 150, h: 56 },
];

const SPRINKLE_COLORS = [
  "#ff6f9f",
  "#ffd166",
  "#fff3ee",
  "#e9a4bd",
  "#f7c65d",
];

/* =========================================================
   STRAWBERRY
========================================================= */

function Strawberry({
  x,
  y,
  scale = 1,
  rotate = 0,
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    >
      {/* Leaves */}
      <path
        d="
          M0 -13
          C-9 -19 -14 -12 -7 -7
          C-14 -8 -14 0 -4 -2
          C-8 5 2 5 4 -2
          C11 1 15 -7 7 -8
          C13 -14 6 -19 0 -13Z
        "
        fill="#6fa94a"
        stroke="#47752f"
        strokeWidth="1"
      />

      {/* Berry */}
      <path
        d="
          M0 -8
          C-18 2 -15 21 0 30
          C15 21 18 2 0 -8Z
        "
        fill="url(#berryGradient)"
        stroke="#a62e50"
        strokeWidth="1"
      />

      {/* Highlight */}
      <ellipse
        cx="-6"
        cy="7"
        rx="4"
        ry="9"
        fill="#fff"
        opacity=".18"
      />

      {/* Seeds */}
      {[
        [-7, 4],
        [0, 8],
        [7, 4],
        [-5, 14],
        [5, 14],
        [0, 20],
      ].map(([sx, sy], index) => (
        <ellipse
          key={index}
          cx={sx}
          cy={sy}
          rx="1"
          ry="2"
          fill="#ffd8a8"
          opacity=".9"
        />
      ))}
    </g>
  );
}

/* =========================================================
   FLOWER
========================================================= */

function Flower({
  x,
  y,
  scale = 1,
  pink = false,
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <g
        fill={
          pink
            ? "#f08baa"
            : "#fff5ed"
        }
      >
        <ellipse
          cy="-7"
          rx="5"
          ry="8"
        />

        <ellipse
          cy="7"
          rx="5"
          ry="8"
        />

        <ellipse
          cx="-7"
          rx="8"
          ry="5"
        />

        <ellipse
          cx="7"
          rx="8"
          ry="5"
        />
      </g>

      <circle
        r="4"
        fill={
          pink
            ? "#ffd36b"
            : "#e8ad58"
        }
      />

      <circle
        r="2"
        fill="#fff6cc"
      />
    </g>
  );
}

/* =========================================================
   CANDLE
========================================================= */

function Candle({
  candle,
  blown,
  onClick,
}) {
  const {
    x,
    y,
    h,
  } = candle;

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!blown && typeof onClick === "function") {
      onClick();
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (
        !blown &&
        typeof onClick === "function"
      ) {
        onClick();
      }
    }
  };

  return (
    <g
      className={`svg-candle ${
        blown ? "is-blown" : ""
      }`}
      transform={`translate(${x} ${y})`}
      pointerEvents="all"
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={blown ? -1 : 0}
      aria-label={
        blown
          ? "Candle blown out"
          : "Blow out candle"
      }
    >
      {/* =================================================
          CANDLE SHADOW
      ================================================= */}

      <ellipse
        cx="0"
        cy="4"
        rx="13"
        ry="4"
        fill="#7d2745"
        opacity=".3"
      />

      {/* =================================================
          CANDLE BODY
      ================================================= */}

      <rect
        className="candle-body"
        x="-7"
        y={-h}
        width="14"
        height={h}
        rx="5"
        fill="url(#candleGradient)"
        stroke="#fff0f4"
        strokeWidth="1"
      />

      {/* =================================================
          CANDLE STRIPES
      ================================================= */}

      {Array.from({ length: 4 }).map(
        (_, index) => {
          const y1 =
            -h +
            index * 15 +
            4;

          return (
            <path
              key={index}
              d={`
                M-7 ${y1}
                C-1 ${y1 + 6}
                 2 ${y1 + 6}
                 7 ${y1}
              `}
              fill="none"
              stroke="#fff1f5"
              strokeWidth="3"
              opacity=".8"
            />
          );
        }
      )}

      {/* =================================================
          CANDLE HIGHLIGHT
      ================================================= */}

      <rect
        x="-4"
        y={-h + 4}
        width="2"
        height={Math.max(h - 8, 4)}
        rx="1"
        fill="#fff"
        opacity=".35"
        pointerEvents="none"
      />

      {/* =================================================
          CANDLE TOP
      ================================================= */}

      <ellipse
        cx="0"
        cy={-h}
        rx="7"
        ry="3"
        fill="#ffd9e5"
        stroke="#b94c70"
        strokeWidth="1"
      />

      {/* =================================================
          WICK
      ================================================= */}

      <path
        d={`
          M0 ${-h - 1}
          C-1 ${-h - 7}
           1 ${-h - 9}
           0 ${-h - 12}
        `}
        stroke="#3b2024"
        strokeWidth="1.5"
        fill="none"
      />

      {/* =================================================
          FLAME
      ================================================= */}

      <g
        className="candle-fire"
        pointerEvents="none"
      >
        {/* Flame glow */}
        <circle
          className="flame-glow"
          cx="0"
          cy={-h - 17}
          r="15"
          fill="#ff9b4a"
          opacity=".12"
        />

        {/* Outer flame */}
        <path
          className="flame-outer"
          d={`
            M0 ${-h - 11}
            C-8 ${-h - 20}
             4 ${-h - 25}
             1 ${-h - 36}
            C12 ${-h - 25}
             11 ${-h - 15}
             0 ${-h - 11}Z
          `}
          fill="url(#flameGradient)"
        />

        {/* Inner flame */}
        <path
          className="flame-inner"
          d={`
            M0 ${-h - 13}
            C-4 ${-h - 19}
             3 ${-h - 22}
             1 ${-h - 28}
            C7 ${-h - 20}
             6 ${-h - 15}
             0 ${-h - 13}Z
          `}
          fill="#fff8c7"
        />
      </g>

      {/* =================================================
          SMOKE
      ================================================= */}

      <g
        className="candle-smoke"
        pointerEvents="none"
      >
        <path
          d={`
            M0 ${-h - 32}
            C-8 ${-h - 45}
             10 ${-h - 52}
             0 ${-h - 67}
          `}
          fill="none"
          stroke="#d9c7d0"
          strokeWidth="2"
          strokeLinecap="round"
          opacity=".55"
        />

        <path
          d={`
            M3 ${-h - 34}
            C10 ${-h - 45}
            -6 ${-h - 54}
             4 ${-h - 69}
          `}
          fill="none"
          stroke="#eee1e7"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity=".35"
        />
      </g>
    </g>
  );
}

/* =========================================================
   BIRTHDAY CAKE
========================================================= */

export default function BirthdayCake({
  candles = [],
  onCandleClick,
}) {
  /*
   * Match state by candle ID rather than array position.
   * This is safer and prevents candle state mismatches.
   */
  const candleState = useMemo(() => {
    return CANDLES.map((candle) => {
      const state = candles.find(
        (item) => item.id === candle.id - 1
      );

      return {
        ...candle,
        blown: state?.blown ?? false,
      };
    });
  }, [candles]);

  /* =======================================================
     PEARLS
  ======================================================= */

  const pearls = useMemo(
    () =>
      Array.from(
        { length: 27 },
        (_, index) => {
          const t = index / 26;

          const x =
            58 +
            t * 244;

          const y =
            258 +
            Math.sin(t * Math.PI) * 13;

          return {
            x,
            y,
            r:
              index % 3 === 0
                ? 3
                : 2.3,
          };
        }
      ),
    []
  );

  /* =======================================================
     SPRINKLES
  ======================================================= */

  const sprinkles = useMemo(() => {
    return Array.from(
      { length: 42 },
      (_, index) => {
        const angle =
          (index / 42) *
          Math.PI *
          2;

        const rx = 92;
        const ry = 21;

        const spread =
          (index % 5) / 10 +
          0.55;

        return {
          x:
            180 +
            Math.cos(angle) *
              rx *
              spread,

          y:
            150 +
            Math.sin(angle) *
              ry,

          rotation:
            (index * 47) % 180,

          color:
            SPRINKLE_COLORS[
              index %
                SPRINKLE_COLORS.length
            ],
        };
      }
    );
  }, []);

  return (
    <div className="birthday-cake-svg">
      <svg
        viewBox="0 0 360 330"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Birthday cake for MUB"
        role="img"
      >
        <defs>

          {/* =================================================
              CAKE BODY
          ================================================= */}

          <linearGradient
            id="cakeGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#fff0ee"
            />

            <stop
              offset="28%"
              stopColor="#f7cbd2"
            />

            <stop
              offset="55%"
              stopColor="#e89aae"
            />

            <stop
              offset="100%"
              stopColor="#bd5578"
            />
          </linearGradient>

          {/* Cake shade */}

          <linearGradient
            id="cakeShade"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity=".2"
            />

            <stop
              offset="45%"
              stopColor="#9b3f62"
              stopOpacity=".08"
            />

            <stop
              offset="100%"
              stopColor="#5e1937"
              stopOpacity=".4"
            />
          </linearGradient>

          {/* =================================================
              TOP FROSTING
          ================================================= */}

          <radialGradient
            id="topFrosting"
          >
            <stop
              offset="0%"
              stopColor="#fffaf8"
            />

            <stop
              offset="45%"
              stopColor="#ffe1e8"
            />

            <stop
              offset="78%"
              stopColor="#f3b4c6"
            />

            <stop
              offset="100%"
              stopColor="#d77c9a"
            />
          </radialGradient>

          {/* =================================================
              STRAWBERRY
          ================================================= */}

          <linearGradient
            id="berryGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ff9aae"
            />

            <stop
              offset="35%"
              stopColor="#f04e73"
            />

            <stop
              offset="75%"
              stopColor="#c72f55"
            />

            <stop
              offset="100%"
              stopColor="#8e203e"
            />
          </linearGradient>

          {/* =================================================
              CANDLE
          ================================================= */}

          <linearGradient
            id="candleGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#a9365d"
            />

            <stop
              offset="22%"
              stopColor="#f58cac"
            />

            <stop
              offset="50%"
              stopColor="#fff1f5"
            />

            <stop
              offset="76%"
              stopColor="#ed7399"
            />

            <stop
              offset="100%"
              stopColor="#9f3157"
            />
          </linearGradient>

          {/* =================================================
              FLAME
          ================================================= */}

          <linearGradient
            id="flameGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#fff7bd"
            />

            <stop
              offset="45%"
              stopColor="#ffd35a"
            />

            <stop
              offset="100%"
              stopColor="#ff713c"
            />
          </linearGradient>

          {/* =================================================
              GOLD PLATE
          ================================================= */}

          <linearGradient
            id="goldGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#fff2b5"
            />

            <stop
              offset="25%"
              stopColor="#d8a746"
            />

            <stop
              offset="50%"
              stopColor="#fff0a7"
            />

            <stop
              offset="75%"
              stopColor="#bd8628"
            />

            <stop
              offset="100%"
              stopColor="#f3d16d"
            />
          </linearGradient>

          {/* =================================================
              SHADOW
          ================================================= */}

          <filter id="cakeShadow">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="10"
              floodColor="#000"
              floodOpacity=".5"
            />
          </filter>

          <filter id="softGlow">
            <feGaussianBlur
              stdDeviation="4"
            />
          </filter>

          {/* =================================================
              PEARLS
          ================================================= */}

          <radialGradient
            id="pearlGradient"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
            />

            <stop
              offset="55%"
              stopColor="#ffe8ef"
            />

            <stop
              offset="100%"
              stopColor="#d997ad"
            />
          </radialGradient>

        </defs>

        {/* ===================================================
            GROUND SHADOW
        =================================================== */}

        <ellipse
          cx="180"
          cy="304"
          rx="130"
          ry="16"
          fill="#000"
          opacity=".45"
          filter="url(#softGlow)"
        />

        {/* ===================================================
            GOLD CAKE BOARD
        =================================================== */}

        <ellipse
          cx="180"
          cy="292"
          rx="176"
          ry="30"
          fill="#160b10"
          opacity=".6"
        />

        <ellipse
          cx="180"
          cy="278"
          rx="178"
          ry="34"
          fill="url(#goldGradient)"
          filter="url(#cakeShadow)"
        />

        <ellipse
          cx="180"
          cy="271"
          rx="170"
          ry="30"
          fill="#e8c47c"
        />

        <ellipse
          cx="180"
          cy="271"
          rx="170"
          ry="30"
          fill="none"
          stroke="#fff4cf"
          strokeWidth="2"
          opacity=".8"
        />

        {/* ===================================================
            CAKE BODY
        =================================================== */}

        <path
          d="
            M52 150
            V252
            C52 272 108 284 180 284
            S308 272 308 252
            V150Z
          "
          fill="url(#cakeGradient)"
          stroke="#f9d7de"
          strokeWidth="1"
          filter="url(#cakeShadow)"
        />

        {/* Cake depth */}

        <path
          d="
            M52 205
            V252
            C52 272 108 284 180 284
            S308 272 308 252
            V205
            C285 224 238 233 180 233
            S75 224 52 205Z
          "
          fill="url(#cakeShade)"
          opacity=".55"
        />

        {/* Sponge highlights */}

        <path
          d="M78 177V250"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".18"
        />

        <path
          d="M285 181V251"
          stroke="#8e3458"
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".16"
        />

        {/* ===================================================
            FROSTING DRIPS
        =================================================== */}

        <g fill="#f3a4bb">
          <path d="M61 168C61 190 71 192 71 168Z" />
          <path d="M91 171C91 187 101 188 101 171Z" />
          <path d="M260 169C260 194 272 194 272 169Z" />
          <path d="M289 167C289 184 299 185 299 167Z" />
        </g>

        <g fill="#c84d75">
          <path d="M66 163C66 188 72 188 72 163Z" />
          <path d="M265 164C265 191 271 191 271 164Z" />
        </g>

        {/* ===================================================
            TOP FROSTING
        =================================================== */}

        <ellipse
          cx="180"
          cy="150"
          rx="128"
          ry="34"
          fill="url(#topFrosting)"
          stroke="#e8afc0"
          strokeWidth="2"
        />

        <ellipse
          cx="180"
          cy="153"
          rx="118"
          ry="27"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          opacity=".65"
        />

        {/* Frosting shine */}

        <ellipse
          cx="145"
          cy="139"
          rx="55"
          ry="12"
          fill="#fff"
          opacity=".22"
        />

        {/* ===================================================
            SPRINKLES
        =================================================== */}

        <g>
          {sprinkles.map((sprinkle, index) => (
            <rect
              key={index}
              x={sprinkle.x}
              y={sprinkle.y}
              width="5"
              height="1.8"
              rx="1"
              fill={sprinkle.color}
              transform={`
                rotate(
                  ${sprinkle.rotation}
                  ${sprinkle.x}
                  ${sprinkle.y}
                )
              `}
              opacity=".85"
            />
          ))}
        </g>

        {/* ===================================================
            STRAWBERRIES
        =================================================== */}

        <Strawberry
          x={91}
          y={184}
          scale=".7"
          rotate="-12"
        />

        <Strawberry
          x={269}
          y={183}
          scale=".72"
          rotate="13"
        />

        <Strawberry
          x={125}
          y={164}
          scale=".48"
          rotate="-8"
        />

        <Strawberry
          x={235}
          y={164}
          scale=".48"
          rotate="8"
        />

        {/* ===================================================
            CREAM SWIRLS
        =================================================== */}

        <g
          fill="none"
          stroke="#fff7f7"
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".9"
        >
          <path d="M76 202 C82 191 92 191 98 202 C103 211 112 211 117 201" />

          <path d="M243 201 C249 190 259 190 265 201 C270 210 280 210 285 199" />
        </g>

        {/* ===================================================
            FLOWERS
        =================================================== */}

        <Flower
          x={76}
          y={221}
          scale=".72"
        />

        <Flower
          x={284}
          y={221}
          scale=".72"
          pink
        />

        <Flower
          x={112}
          y={153}
          scale=".52"
          pink
        />

        <Flower
          x={248}
          y={153}
          scale=".52"
        />

        {/* ===================================================
            PEARLS
        =================================================== */}

        <g>
          {pearls.map((pearl, index) => (
            <circle
              key={index}
              cx={pearl.x}
              cy={pearl.y}
              r={pearl.r}
              fill="url(#pearlGradient)"
              stroke="#d69aae"
              strokeWidth=".5"
            />
          ))}
        </g>

        {/* ===================================================
            CAKE WRITING
        =================================================== */}

        <g
          textAnchor="middle"
          fill="#a9683b"
          fontFamily="'Brush Script MT', 'Segoe Script', cursive"
        >
          <text
            x="180"
            y="211"
            fontSize="27"
            stroke="#fff5e7"
            strokeWidth=".8"
            paintOrder="stroke"
          >
            Happy Birthday
          </text>

          <text
            x="180"
            y="243"
            fontSize="31"
            fontWeight="600"
            letterSpacing="2"
            stroke="#fff5e7"
            strokeWidth=".8"
            paintOrder="stroke"
          >
            MUB ♥
          </text>
        </g>

        {/* ===================================================
            CANDLES
        =================================================== */}

        <g>
          {candleState.map((candle) => (
            <Candle
              key={candle.id}
              candle={candle}
              blown={candle.blown}
              onClick={() =>
                onCandleClick?.(
                  candle.id - 1
                )
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
}