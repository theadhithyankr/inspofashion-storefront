'use client'

export function SoldOutBadge() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="sold-out-badge">
        {/* SVG Hook and strings with dusty rose color */}
        <svg
          className="badge-hook"
          width="90"
          height="70"
          viewBox="0 0 90 70"
          preserveAspectRatio="none"
        >
          {/* Small circle hook at top */}
          <circle cx="45" cy="10" r="4.5" fill="#b89a9a" opacity="0.8" />

          {/* Left hanging string */}
          <line
            x1="40"
            y1="14"
            x2="18"
            y2="52"
            stroke="#b89a9a"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Right hanging string */}
          <line
            x1="50"
            y1="14"
            x2="72"
            y2="52"
            stroke="#b89a9a"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        {/* Badge signboard */}
        <div className="badge-signboard">
          <span className="badge-text">Sold Out</span>
        </div>
      </div>

      <style jsx>{`
        .sold-out-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: default;
          animation: fadeIn 0.5s ease-out;
          transform-origin: 50% 50%;
          position: relative;
        }

        .badge-hook {
          display: block;
          height: 50px;
          width: 66px;
          margin-bottom: -17px;
          z-index: 1;
          filter: drop-shadow(0 1px 2px rgba(184, 154, 154, 0.1));
        }

        .badge-signboard {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 11px 18px;
          min-width: 95px;
          height: 50px;
          background: linear-gradient(135deg, rgba(252, 248, 245, 0.92) 0%, rgba(249, 244, 240, 0.88) 100%);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(184, 154, 154, 0.35);
          border-radius: 10px;
          transform: rotate(-9deg);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            0 0 20px rgba(184, 154, 154, 0.08);
          z-index: 2;
          transition: all 300ms ease-out;
        }

        .badge-signboard:hover {
          transform: rotate(-9deg) scale(1.05);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 0 24px rgba(184, 154, 154, 0.12);
        }

        .badge-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            sans-serif;
          font-size: 11px;
          font-weight: 560;
          letter-spacing: 0.26em;
          color: #000000;
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
          text-align: center;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive sizing */
        @media (max-width: 640px) {
          .badge-signboard {
            padding: 10px 16px;
            min-width: 88px;
            height: 46px;
            border-radius: 9px;
          }

          .badge-text {
            font-size: 10px;
            letter-spacing: 0.22em;
          }

          .badge-hook {
            height: 46px;
            width: 60px;
            margin-bottom: -16px;
          }
        }

        @media (max-width: 380px) {
          .badge-signboard {
            padding: 9px 14px;
            min-width: 80px;
            height: 42px;
            border-radius: 8px;
          }

          .badge-text {
            font-size: 9px;
            letter-spacing: 0.20em;
          }

          .badge-hook {
            height: 42px;
            width: 55px;
            margin-bottom: -14px;
          }
        }
      `}</style>
    </div>
  )
}
