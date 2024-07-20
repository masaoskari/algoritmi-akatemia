export const CodeEditor = () => {
  return (
    <div>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div className="rounded-tl-md rounded-tr-md bg-blue-600 flex justify-between items-center p-4">
          <p className="text-white">Nimi</p>
          <p className="text-white">Pisteet: 10</p>
        </div>
        <div className="pl-4">Tähän tulee harjoituksen kuvaus</div>
        <div className="bg-black h-48 w-96"></div>
      </div>
    </div>
  );
};
