type Props = {
  status: string;
};

const statusSteps = ["ORDER PLACED", "PROCESSED", "SHIPPED", "DELIVERED"];

export const OrderProgressBar = ({ status }: Props) => {
  const currentStep = statusSteps.indexOf(status);

  return (
    <div>
      <div className="flex justify-between  mb-2">
        {statusSteps.map((step, index) => (
          <span
            key={step}
            className={`font-medium text-xs lg:text-sm  truncate  capitalize ${
              index <= currentStep ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{
            width: `${((currentStep + 1) / statusSteps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
