import { branchesTable} from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

//Full schema from DB
export type Branch = InferSelectModel<typeof branchesTable>

export type NewBranch = InferInsertModel<typeof branchesTable>
