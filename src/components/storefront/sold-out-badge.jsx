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
          height: 70px;
          width: 90px;
          margin-bottom: -24px;
          z-index: 1;
          filter: drop-shadow(0 1px 2px rgba(184, 154, 154, 0.1));
        }

        .badge-signboard {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px 28px;
          min-width: 130px;
          height: 70px;
          background: linear-gradient(135deg, rgba(252, 248, 245, 0.92) 0%, rgba(249, 244, 240, 0.88) 100%);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(184, 154, 154, 0.35);
          border-radius: 14px;
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
          font-size: 14px;
          font-weight: 560;
          letter-spacing: 0.32em;
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
            padding: 16px 24px;
            min-width: 120px;
            height: 65px;
            border-radius: 12px;
          }

          .badge-text {
            font-size: 13px;
            letter-spacing: 0.28em;
          }

          .badge-hook {
            height: 62px;
            width: 80px;
            margin-bottom: -22px;
          }
        }

        @media (max-width: 380px) {
          .badge-signboard {
            padding: 14px 20px;
            min-width: 110px;
            height: 60px;
            border-radius: 10px;
          }

          .badge-text {
            font-size: 12px;
            letter-spacing: 0.25em;
          }

          .badge-hook {
            height: 54px;
            width: 72px;
            margin-bottom: -20px;
          }
        }
      `}</style>
    </div>
  )
}
