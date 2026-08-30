import {
  Navigate,
  useParams,
} from "react-router-dom";

import { ROUTES } from "@/routes/routePaths";

export default function DocumentQuestions() {
  const { documentId } = useParams<{
    documentId: string;
  }>();

  const parsedDocumentId =
    documentId !== undefined
      ? Number(documentId)
      : Number.NaN;

  const isValidDocumentId =
    Number.isInteger(parsedDocumentId) &&
    parsedDocumentId > 0;

  if (!isValidDocumentId) {
    return (
      <Navigate
        to={ROUTES.documents}
        replace
      />
    );
  }

  return (
    <Navigate
      to={`/conversations/${parsedDocumentId}`}
      replace
    />
  );
}