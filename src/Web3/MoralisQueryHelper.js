import Moralis from "moralis";

const checkRules = async (element1, element2) => {
  const MergeRule = Moralis.Object.extend("MergeRule");
  const query = new Moralis.Query(MergeRule);
  query.equalTo("Element1", element1);
  query.equalTo("Element2", element2);
  const results = await query.find();
  if (results.length === 0) {
    return null;
  } else {
    return results[0].get("Result");
  }
};

export { checkRules };
