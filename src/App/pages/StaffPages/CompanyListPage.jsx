import Button from "@/Core/components/common/Button";
import Modal from "@/Core/components/common/Modal";
import Table from "@/Core/components/common/Table/CoreTable";
import React, { useState } from "react";

const CompanyListPage = () => {
	const [openState, setOpenState] = useState(false);
	return (
		<>
			<Modal openState={openState} onOpenStateChange={setOpenState} title={"This is modal"}>
				<h1 className="text-2xl font-medium text-primary">Hello</h1>
			</Modal>
			<Button variant="outline" size="md" onClick={() => setOpenState(true)}>
				Open modal
			</Button>
		</>
	);
};

export default CompanyListPage;
