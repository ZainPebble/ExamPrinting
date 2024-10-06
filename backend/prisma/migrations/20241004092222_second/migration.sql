/*
  Warnings:

  - The primary key for the `backup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Status` on the `backup` table. All the data in the column will be lost.
  - You are about to alter the column `S_ID` on the `backup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(7)`.
  - You are about to alter the column `Year` on the `backup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Year`.
  - You are about to alter the column `S_name` on the `backup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `examdetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `S_ID` on the `examdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(7)`.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Name` on the `subject` table. All the data in the column will be lost.
  - You are about to alter the column `S_ID` on the `subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(7)`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `Fname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `Lname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `Additional` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Date` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ExamFile` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exam_end` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exam_start` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Room` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Side` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type_exam` to the `Backup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Additional` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Date` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ExamFile` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exam_end` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exam_period` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exam_start` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Room` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Side` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tool_Book` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tool_Calculator` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tool_MfRuler` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type_exam` to the `ExamDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Credit` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Major` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `S_name` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sec` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Semester` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n_std` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tel` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `backup` DROP FOREIGN KEY `backup_T_ID_fkey`;

-- DropForeignKey
ALTER TABLE `examdetail` DROP FOREIGN KEY `examdetail_S_ID_fkey`;

-- DropForeignKey
ALTER TABLE `subject` DROP FOREIGN KEY `subject_T_ID_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `teacher_username_fkey`;

-- AlterTable
ALTER TABLE `backup` DROP PRIMARY KEY,
    DROP COLUMN `Status`,
    ADD COLUMN `Additional` TEXT NOT NULL,
    ADD COLUMN `Date` DATE NOT NULL,
    ADD COLUMN `ExamFile` LONGBLOB NOT NULL,
    ADD COLUMN `Exam_end` TIME NOT NULL,
    ADD COLUMN `Exam_start` TIME NOT NULL,
    ADD COLUMN `Room` VARCHAR(10) NOT NULL,
    ADD COLUMN `Side` INTEGER NOT NULL,
    ADD COLUMN `Type_exam` INTEGER NOT NULL,
    MODIFY `S_ID` VARCHAR(7) NOT NULL,
    MODIFY `Year` YEAR NOT NULL,
    MODIFY `S_name` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`S_ID`, `Year`, `Semester`, `XD_ID`);

-- AlterTable
ALTER TABLE `examdetail` DROP PRIMARY KEY,
    ADD COLUMN `Additional` TEXT NOT NULL,
    ADD COLUMN `Date` DATE NOT NULL,
    ADD COLUMN `ExamFile` LONGBLOB NOT NULL,
    ADD COLUMN `Exam_end` TIME NOT NULL,
    ADD COLUMN `Exam_period` INTEGER NOT NULL,
    ADD COLUMN `Exam_start` TIME NOT NULL,
    ADD COLUMN `Room` VARCHAR(10) NOT NULL,
    ADD COLUMN `Side` INTEGER NOT NULL,
    ADD COLUMN `Tool_Book` BOOLEAN NOT NULL,
    ADD COLUMN `Tool_Calculator` BOOLEAN NOT NULL,
    ADD COLUMN `Tool_MfRuler` BOOLEAN NOT NULL,
    ADD COLUMN `Type_exam` INTEGER NOT NULL,
    MODIFY `S_ID` VARCHAR(7) NOT NULL,
    ADD PRIMARY KEY (`S_ID`, `XD_ID`);

-- AlterTable
ALTER TABLE `subject` DROP PRIMARY KEY,
    DROP COLUMN `Name`,
    ADD COLUMN `Credit` INTEGER NOT NULL,
    ADD COLUMN `Major` INTEGER NOT NULL,
    ADD COLUMN `S_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `Sec` INTEGER NOT NULL,
    ADD COLUMN `Semester` INTEGER NOT NULL,
    ADD COLUMN `Status` INTEGER NOT NULL,
    ADD COLUMN `Year` YEAR NOT NULL,
    ADD COLUMN `n_std` INTEGER NOT NULL,
    MODIFY `S_ID` VARCHAR(7) NOT NULL,
    ADD PRIMARY KEY (`S_ID`);

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `Email` VARCHAR(255) NOT NULL,
    ADD COLUMN `Tel` INTEGER NOT NULL,
    MODIFY `username` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `username` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `Fname` VARCHAR(100) NOT NULL,
    MODIFY `Lname` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`username`);

-- CreateIndex
CREATE INDEX `T_ID-username` ON `Teacher`(`username`);

-- AddForeignKey
ALTER TABLE `Backup` ADD CONSTRAINT `Backup_T_ID_fkey` FOREIGN KEY (`T_ID`) REFERENCES `Teacher`(`T_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamDetail` ADD CONSTRAINT `ExamDetail_S_ID_fkey` FOREIGN KEY (`S_ID`) REFERENCES `Subject`(`S_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_T_ID_fkey` FOREIGN KEY (`T_ID`) REFERENCES `Teacher`(`T_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_username_fkey` FOREIGN KEY (`username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
