import EditProductInfo from "./agent/EditProductInfo";
import NewProductInfo from "./agent/NewProductInfo";
import ProductInfo from "./agent/ProductInfo";
import Categories from "./client/Categories";
import Chat from "./client/Chat";
import Products from "./client/Products";
import {
  isSameSenderMargin,
  isSameSender,
  isLastMessage,
  isSameUser,
  getSender,
  getSenderFull,
} from "./config/ChatLogics";
import ProtectedRoute from "./config/ProtectedRoute";
import CheckInfo from "./misc/CheckInfo";
import FormatPrice from "./misc/FormatPrice";
import {
  dataInstruction,
  dataColor,
  dataManual,
  dataBrand,
  dataBrandIPad,
  dataBrandLaptop,
  dataFilterPrice,
  data2,
  dataMonth,
  dataMaterial,
  dataBackCamera,
  dataSelfie,
  dataOthers,
  dataFilterBrandPhone,
  dataCameraRes,
  dataAccessories,
  status,
  category,
  dataSpecial,
  dataBattery,
} from "./misc/ProductData";
import QuillChat from "./misc/QuillChat";
import QuillEditor from "./misc/QuillEditor";
import NavBar from "./navbar/NavBar";
export {
  EditProductInfo,
  NewProductInfo,
  ProductInfo,
  Categories,
  Chat,
  Products,
  isSameSenderMargin,
  isSameSender,
  isLastMessage,
  isSameUser,
  getSender,
  getSenderFull,
  ProtectedRoute,
  CheckInfo,
  FormatPrice,
  dataInstruction,
  dataColor,
  dataManual,
  dataBrand,
  dataBrandIPad,
  dataBrandLaptop,
  dataFilterPrice,
  data2,
  dataMonth,
  dataMaterial,
  dataBackCamera,
  dataSelfie,
  dataOthers,
  dataFilterBrandPhone,
  dataCameraRes,
  dataAccessories,
  status,
  category,
  dataSpecial,
  dataBattery,
  QuillChat,
  QuillEditor,
  NavBar,
};
