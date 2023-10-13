

const Alert = (props) => {

    // change color based on alert type
    const successClass = "border border-green-500 flex p-4 mb-4 text-sm rounded-lg bg-gray-800 text-green-400";
    const failureClass = "border border-red-500 flex p-4 mb-4 text-sm rounded-lg bg-gray-800 text-red-400";

    return(
        <div className={props.isSuccess ? successClass : failureClass} role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 mr-3 mt-[2px]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <div>
                <span className="font-medium">{props.title}</span>
                <ul className="mt-1.5 ml-4 list-disc list-inside">
                    {props.items.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default Alert;