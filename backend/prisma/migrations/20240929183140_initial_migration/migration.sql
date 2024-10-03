-- CreateTable
CREATE TABLE `user` (
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `Fname` VARCHAR(191) NOT NULL,
    `Lname` VARCHAR(191) NOT NULL,
    `u_type` INTEGER NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher` (
    `T_ID` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `teacher_username_key`(`username`),
    PRIMARY KEY (`T_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject` (
    `S_ID` VARCHAR(191) NOT NULL,
    `T_ID` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`S_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `examdetail` (
    `S_ID` VARCHAR(191) NOT NULL,
    `XD_ID` INTEGER NOT NULL,

    PRIMARY KEY (`S_ID`, `XD_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup` (
    `S_ID` VARCHAR(191) NOT NULL,
    `Year` INTEGER NOT NULL,
    `Semester` INTEGER NOT NULL,
    `XD_ID` INTEGER NOT NULL,
    `Exam_period` INTEGER NOT NULL,
    `S_name` VARCHAR(191) NOT NULL,
    `Credit` INTEGER NOT NULL,
    `Sec` INTEGER NOT NULL,
    `Major` INTEGER NOT NULL,
    `Status` INTEGER NOT NULL,
    `n_std` INTEGER NOT NULL,
    `T_ID` INTEGER NOT NULL,

    PRIMARY KEY (`S_ID`, `Year`, `Semester`, `XD_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `subject_T_ID_fkey` FOREIGN KEY (`T_ID`) REFERENCES `teacher`(`T_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `examdetail` ADD CONSTRAINT `examdetail_S_ID_fkey` FOREIGN KEY (`S_ID`) REFERENCES `subject`(`S_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `backup` ADD CONSTRAINT `backup_T_ID_fkey` FOREIGN KEY (`T_ID`) REFERENCES `teacher`(`T_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
