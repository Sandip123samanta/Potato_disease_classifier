import React from 'react';

function PredictionCard({ confidance, diseaseClass, subImage }) {
  return (
    <div className="mb-5">
      <div className="prediction-container flex items-center gap-5 border border-white/30 w-[20em] md:w-[30em] p-2 rounded-lg">
        <div className="prediction-image object-cover w-16 h-16 rounded-full overflow-hidden">
          <img src={subImage} alt="uploaded potato leaf image" />
        </div>
        <div className="text-white text-semibold text-[1.2em] flex flex-col justify-center gap-1">
          <h2>
            Confidance<span className="font-bold"> : </span>
            <span className="font-bold text-green-500">
              {Math.floor(confidance * 100)}
            </span>
          </h2>
          <h2>
            Result <span className="font-bold"> : </span>
            <span
              className={`${
                diseaseClass === 'Early Blight' || 'Late Blight'
                  ? 'text-red-500'
                  : 'text-green-500'
              } font-bold`}
            >
              {diseaseClass}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default PredictionCard;
